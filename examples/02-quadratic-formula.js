const pseudo = require('../index.js');

async function quadratic(a, b, c) {
  const d = Math.sqrt(await pseudo("compute discriminant of quadratic equation", a, b, c));
  const root1 = ((-b) + d) / (2 * a);
  const root2 = ((-b) - d) / (2 * a);
  return [root1, root2];
}

// Usage
quadratic(1, 2, -3).then(([root1, root2]) => {
  console.log(root1, root2); // Expected: 1.0, -3.0
});