const pseudo = require('../index.js');

async function dateOperations(dateString) {
  const dayOfWeek = await pseudo("get day of week from date string", dateString);
  const daysUntilNewYear = await pseudo("calculate days until next new year", dateString);
  const formatted = await pseudo("format date as 'Month DD, YYYY'", dateString);
  return { dayOfWeek, daysUntilNewYear, formatted };
}

async function timeComparison(time1, time2) {
  return await pseudo("calculate difference in minutes between two times", time1, time2);
}

// Usage
dateOperations("2024-03-15").then(result => {
  console.log(result); // Expected: { dayOfWeek: "Friday", daysUntilNewYear: 291, formatted: "March 15, 2024" }
});

timeComparison("14:30", "16:45").then(diff => {
  console.log(diff); // Expected: 135 (minutes)
});