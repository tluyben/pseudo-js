const pseudo = require('../index.js');

async function formatName(firstName, lastName) {
  const initials = await pseudo("create initials from first and last name", firstName, lastName);
  const fullName = await pseudo("create full name in 'Last, First' format", firstName, lastName);
  return { initials, fullName };
}

// Usage
formatName("John", "Doe").then(result => {
  console.log(result); // Expected: { initials: "J.D.", fullName: "Doe, John" }
});