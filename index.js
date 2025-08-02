const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function callOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4';
  const provider = process.env.OPENROUTER_PROVIDER;
  const debug = process.env.DEBUG === 'true';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required');
  }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://github.com/pseudo-js',
    'X-Title': 'pseudo-js'
  };

  if (provider) {
    headers['X-OpenRouter-Provider'] = provider;
  }

  const requestBody = {
    model,
    messages: [
      {
        role: 'system',
        content: 'You are a code generator. You will be given code context and a specification. Return ONLY a simple JavaScript expression (not a statement) that implements the specification. Use arg0, arg1, arg2, etc. for arguments. Do not include variable declarations, function definitions, or await calls. Just return the expression that computes the result.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.1,
    stream: debug
  };

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  if (debug) {
    console.log('\n🔍 DEBUG: Streaming LLM response:');
    let fullContent = '';
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              process.stdout.write(content);
              fullContent += content;
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    }
    
    console.log('\n🔍 DEBUG: End of stream\n');
    return fullContent.trim();
  } else {
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
}

function getArgumentsInfo(args) {
  return args.map(arg => {
    const type = typeof arg;
    if (type === 'object' && arg !== null) {
      return {
        type: 'object',
        value: JSON.stringify(arg, null, 2)
      };
    }
    return {
      type,
      value: String(arg)
    };
  });
}

async function pseudo(specification, ...args) {
  const err = new Error();
  const stack = err.stack.split('\n');

  // The second line in the stack is the caller
  const callerLine = stack[2];
  const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);

  if (!match) {
    console.error('Could not parse stack:', callerLine);
    throw new Error('Could not determine caller location');
  }

  const [, file, lineStr] = match;
  const line = parseInt(lineStr, 10);

  // Read file
  let src;
  try {
    src = fs.readFileSync(file, 'utf8').split('\n');
  } catch (error) {
    throw new Error(`Could not read file ${file}: ${error.message}`);
  }

  // Take 10 lines before and after
  const start = Math.max(0, line - 11);
  const end = Math.min(src.length, line + 9);
  const snippet = src.slice(start, end).map((l, i) => {
    const actualLine = start + i + 1;
    return (actualLine === line ? '>> ' : '   ') + actualLine + ' | ' + l;
  }).join('\n');

  // Build prompt
  let prompt = `In this code context:\n\n${snippet}\n\n`;
  prompt += `Replace the code at line ${line} (marked with >>) with JavaScript that implements: "${specification}"\n\n`;

  if (args.length > 0) {
    const argsInfo = getArgumentsInfo(args);
    prompt += 'Available arguments (use these exact variable names):\n';
    argsInfo.forEach((arg, index) => {
      prompt += `  arg${index} (${arg.type}): ${arg.value}\n`;
    });
    prompt += '\n';
  }

  prompt += 'Return ONLY a simple JavaScript expression (no statements, no const/let/var, no function definitions, no await) that computes the result. Use arg0, arg1, arg2, etc. for the arguments.\n\nExamples:\n- For "add two numbers": arg0 + arg1\n- For "square of first argument": arg0 * arg0\n- For "discriminant": arg1 * arg1 - 4 * arg0 * arg2';

  // Debug mode: show the prompt
  if (process.env.DEBUG === 'true') {
    console.log('\n📝 DEBUG: Prompt being sent to LLM:');
    console.log('='.repeat(60));
    console.log(prompt);
    console.log('='.repeat(60));
  }

  try {
    let generatedCode = await callOpenRouter(prompt);
    
    // Clean up the generated code
    generatedCode = generatedCode.trim();
    
    // Remove leading 'return ' if present since we'll wrap it
    if (generatedCode.startsWith('return ')) {
      generatedCode = generatedCode.slice(7);
    }
    
    // Remove trailing semicolon if present
    if (generatedCode.endsWith(';')) {
      generatedCode = generatedCode.slice(0, -1);
    }
    
    // Try to fix common variable name issues
    if (args.length > 0) {
      // Common patterns: a, b, c, etc. or first, second, etc.
      const varMappings = [
        ['\\ba\\b', 'arg0'], ['\\bb\\b', 'arg1'], ['\\bc\\b', 'arg2'], ['\\bd\\b', 'arg3'],
        ['\\be\\b', 'arg4'], ['\\bf\\b', 'arg5'], ['\\bg\\b', 'arg6'], ['\\bh\\b', 'arg7'],
        ['\\bfirst\\b', 'arg0'], ['\\bsecond\\b', 'arg1'], ['\\bthird\\b', 'arg2']
      ];
      
      for (const [pattern, replacement] of varMappings) {
        const regex = new RegExp(pattern, 'g');
        generatedCode = generatedCode.replace(regex, replacement);
      }
    }
    
    // Debug: show cleaned code
    if (process.env.DEBUG === 'true') {
      console.log(`\n🔧 DEBUG: Cleaned code: ${generatedCode}\n`);
    }
    
    // Create execution context with common utilities and the arguments
    const executionCode = `
      // Extract arguments for easy access
      const [${args.map((_, i) => `arg${i}`).join(', ')}] = args;
      
      // Execute the generated code
      return (${generatedCode});
    `;
    
    const func = new Function('args', executionCode);
    return func(args);
  } catch (error) {
    throw new Error(`Failed to generate or execute code: ${error.message}`);
  }
}

module.exports = pseudo;
