const pseudo = require('../index.js');

async function validateEmail(email) {
  return await pseudo("validate email address format", email);
}

async function validatePassword(password) {
  const checks = await pseudo("check password strength: length >= 8, has uppercase, lowercase, number, special char", password);
  return checks;
}

async function sanitizeInput(userInput) {
  return await pseudo("remove dangerous HTML tags and escape special characters", userInput);
}

async function validateCreditCard(cardNumber) {
  const isValid = await pseudo("validate credit card number using Luhn algorithm", cardNumber);
  const cardType = await pseudo("determine credit card type (Visa, MasterCard, etc.)", cardNumber);
  return { isValid, cardType };
}

// Usage
validateEmail("user@example.com").then(isValid => {
  console.log(isValid); // Expected: true
});

validatePassword("MyP@ssw0rd").then(result => {
  console.log(result); // Expected: object with strength analysis
});

sanitizeInput("<script>alert('xss')</script>Hello").then(clean => {
  console.log(clean); // Expected: cleaned string
});

validateCreditCard("4532015112830366").then(result => {
  console.log(result); // Expected: { isValid: true, cardType: "Visa" }
});