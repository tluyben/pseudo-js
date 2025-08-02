const pseudo = require('../index.js');

async function myFunc(a, b) {
  return await pseudo("multiply b by factorial of a", a, b);
}

// Usage
myFunc(5, 3).then(result => {
  console.log(result); // Expected: 360 (5! * 3 = 120 * 3 = 360)
});