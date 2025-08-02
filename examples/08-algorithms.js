const pseudo = require('../index.js');

async function fibonacci(n) {
  return await pseudo("calculate nth fibonacci number", n);
}

async function isPalindrome(text) {
  return await pseudo("check if string is a palindrome, ignoring case and spaces", text);
}

async function sortByMultipleCriteria(items) {
  return await pseudo("sort items by priority (high first), then by date (newest first)", items);
}

async function findPrimes(limit) {
  return await pseudo("find all prime numbers up to the limit", limit);
}

// Usage
fibonacci(10).then(result => {
  console.log(result); // Expected: 55
});

isPalindrome("A man a plan a canal Panama").then(result => {
  console.log(result); // Expected: true
});

const tasks = [
  { name: "Task 1", priority: "low", date: "2024-01-15" },
  { name: "Task 2", priority: "high", date: "2024-01-10" },
  { name: "Task 3", priority: "high", date: "2024-01-20" }
];
sortByMultipleCriteria(tasks).then(sorted => {
  console.log(sorted);
});

findPrimes(20).then(primes => {
  console.log(primes); // Expected: [2, 3, 5, 7, 11, 13, 17, 19]
});