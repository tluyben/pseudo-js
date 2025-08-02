const pseudo = require('../index.js');

async function circleStats(radius) {
  const area = await pseudo("calculate area of circle", radius);
  const circumference = await pseudo("calculate circumference of circle", radius);
  const diameter = await pseudo("calculate diameter of circle", radius);
  return { area, circumference, diameter };
}

async function triangleArea(base, height) {
  return await pseudo("calculate area of triangle using base and height", base, height);
}

// Usage
circleStats(5).then(result => {
  console.log(result); // Expected: { area: ~78.54, circumference: ~31.42, diameter: 10 }
});

triangleArea(10, 8).then(area => {
  console.log(area); // Expected: 40
});