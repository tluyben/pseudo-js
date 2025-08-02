const pseudo = require('../index.js');

async function analyzeStudents(students) {
  const topStudent = await pseudo("find student with highest grade", students);
  const averageGrade = await pseudo("calculate average grade of all students", students);
  const passingStudents = await pseudo("filter students with grade >= 70", students);
  return { topStudent, averageGrade, passingStudents };
}

async function mergeUserProfiles(profile1, profile2) {
  return await pseudo("merge two user profiles, combining arrays and overriding duplicates", profile1, profile2);
}

// Usage
const students = [
  { name: "Alice", grade: 85 },
  { name: "Bob", grade: 92 },
  { name: "Charlie", grade: 78 },
  { name: "Diana", grade: 65 }
];

analyzeStudents(students).then(result => {
  console.log(result);
});

const user1 = { name: "John", skills: ["JavaScript"], location: "NYC" };
const user2 = { age: 30, skills: ["Python"], company: "TechCorp" };
mergeUserProfiles(user1, user2).then(merged => {
  console.log(merged); // Expected: combined object with merged skills array
});