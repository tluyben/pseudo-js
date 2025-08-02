# pseudo-js

AI-assisted code generation using stack trace context. Generate JavaScript code on-the-fly by describing what you want in plain English.

## Installation

```bash
npm install pseudo-js
```

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure your OpenRouter API credentials in `.env`:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-4
OPENROUTER_PROVIDER=
```

## Usage

```javascript
const pseudo = require('pseudo-js');

// Basic usage
const result = await pseudo("calculate the fibonacci number for n=10");

// With arguments
const spaceship = { x: 100, y: 200, velocity: 50 };
const [x, y] = await pseudo("return the point of the spaceship", spaceship);

// Complex operations
const data = [1, 2, 3, 4, 5];
const filtered = await pseudo("filter even numbers and multiply by 2", data);
```

## How it works

1. **Stack Trace Analysis**: The function uses the JavaScript stack trace to determine where it was called from
2. **Context Extraction**: Reads the source file and extracts 10 lines before and after the call site
3. **AI Generation**: Sends the context and specification to OpenRouter's AI models
4. **Code Execution**: Executes the generated JavaScript and returns the result

## Features

- 🔍 **Context-aware**: Uses surrounding code to understand what you're trying to do
- 🚀 **Type-aware**: Automatically detects and provides type information for arguments
- 📝 **Natural language**: Describe what you want in plain English
- ⚡ **Real-time**: Generates and executes code instantly
- 🔧 **Flexible**: Works with any JavaScript environment

## API

### `pseudo(specification, ...args)`

- `specification` (string): Description of what the code should do
- `...args` (any): Optional arguments that the generated code can use
- Returns: `Promise<any>` - The result of executing the generated code

## Environment Variables

- `OPENROUTER_API_KEY` (required): Your OpenRouter API key
- `OPENROUTER_MODEL` (optional): Model to use (default: `openai/gpt-4`)
- `OPENROUTER_PROVIDER` (optional): Specific provider preference

## License

MIT