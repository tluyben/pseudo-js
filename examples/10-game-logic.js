const pseudo = require('../index.js');

async function calculateDamage(attacker, defender) {
  return await pseudo("calculate damage dealt considering attack, defense, and random factor", attacker, defender);
}

async function movePlayer(player, direction, gameMap) {
  return await pseudo("move player in direction if valid, return new position or null if blocked", player, direction, gameMap);
}

async function checkWinCondition(gameState) {
  return await pseudo("check if game is won, lost, or still in progress", gameState);
}

async function generateRandomLoot(playerLevel, lootTable) {
  return await pseudo("generate random loot appropriate for player level", playerLevel, lootTable);
}

// Usage
const attacker = { attack: 50, weapon: "sword", level: 10 };
const defender = { defense: 30, armor: "chainmail", health: 100 };

calculateDamage(attacker, defender).then(damage => {
  console.log(damage); // Expected: calculated damage value
});

const player = { x: 5, y: 5, health: 100 };
const gameMap = { width: 10, height: 10, walls: [[3, 5], [7, 8]] };
movePlayer(player, "north", gameMap).then(newPos => {
  console.log(newPos); // Expected: { x: 5, y: 4 } or null if blocked
});

const gameState = { 
  player: { health: 50 }, 
  enemies: [], 
  objectives: ["collect key", "reach exit"],
  completed: ["collect key"]
};
checkWinCondition(gameState).then(status => {
  console.log(status); // Expected: "in_progress", "won", or "lost"
});

const lootTable = ["sword", "potion", "gold", "gem", "scroll"];
generateRandomLoot(5, lootTable).then(loot => {
  console.log(loot); // Expected: random loot item(s)
});