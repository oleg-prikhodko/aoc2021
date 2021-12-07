const assert = require("assert");
const fs = require("fs");

function findMinFuel(positions, partTwo = false) {
  const fuelPerPositions = [];
  const max = Math.max(...positions);
  for (let i = 0; i <= max; i++) {
    fuelPerPositions.push(calcFuel(positions, i, partTwo));
  }
  const minFuel = Math.min(...fuelPerPositions);
  const pos = fuelPerPositions.findIndex((fuel) => fuel === minFuel);
  return fuelPerPositions[pos];
}

function calcFuel(positions, n, partTwo) {
  return positions.reduce((acc, pos) => {
    const diff = Math.abs(pos - n);
    return acc + (partTwo ? calcN(diff) : diff);
  }, 0);
}

const cache = new Map();

function calcN(n) {
  if (n === 0 || n === 1) return n;
  if (cache.has(n)) {
    return cache.get(n);
  } else {
    const res = n + calcN(n - 1);
    cache.set(n, res);
    return res;
  }
}

const testPositions = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14];
assert.equal(findMinFuel(testPositions), 37);
assert.equal(findMinFuel(testPositions, true), 168);

const positions = fs.readFileSync("./07.txt", "utf8").split(",").map(Number);
console.log(findMinFuel(positions));
console.log(findMinFuel(positions, true));
