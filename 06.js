const assert = require("assert");
const fs = require("fs");

function getInitialCounter(arr) {
  const dict = new Map();
  for (const el of arr) {
    dict.set(el, (dict.get(el) ?? 0) + 1);
  }
  return dict;
}

function calcNumOfFishAfter(fish, days) {
  let fishNums = getInitialCounter(fish);
  let currentDay = 0;
  while (currentDay < days) {
    const nextFishNums = new Map();
    for (const [num, count] of fishNums.entries()) {
      if (num === 0) {
        nextFishNums.set(8, count);
        nextFishNums.set(6, (nextFishNums.get(6) ?? 0) + count);
      } else {
        const nextNum = num - 1;
        nextFishNums.set(nextNum, (nextFishNums.get(nextNum) ?? 0) + count);
      }
    }
    fishNums = nextFishNums;
    currentDay++;
  }
  return Array.from(fishNums.values()).reduce((acc, num) => acc + num);
}

const testNums = [3, 4, 3, 1, 2];
assert.equal(calcNumOfFishAfter(testNums, 18), 26);
assert.equal(calcNumOfFishAfter(testNums, 80), 5934);
assert.equal(calcNumOfFishAfter(testNums, 256), 26984457539);

const fish = fs.readFileSync("./06.txt", "utf8").trim().split(",").map(Number);
console.log(calcNumOfFishAfter(fish, 80));
console.log(calcNumOfFishAfter(fish, 256));
