const pseudo = require('../index.js');

async function processNumbers(numbers) {
  const evens = await pseudo("filter only even numbers", numbers);
  const doubled = await pseudo("multiply each number by 2", evens);
  const sum = await pseudo("calculate sum of all numbers", doubled);
  return sum;
}

// Usage
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
processNumbers(data).then(result => {
  console.log(result); // Expected: 60 (2+4+6+8+10 = 30, then *2 = 60)
});