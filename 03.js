const assert = require("assert");
const { getLines } = require("./util");

function getLeastAndMostCommon(binaryStrings) {
  const results = {};
  for (const bitChar of binaryStrings) {
    if (bitChar in results) {
      results[bitChar]++;
    } else {
      results[bitChar] = 1;
    }
  }
  const sortedResultKeys = Object.keys(results).sort(
    (a, b) => results[a] - results[b]
  );
  if (sortedResultKeys.length === 1) {
    return [sortedResultKeys[0], sortedResultKeys[0]];
  } else {
    return [sortedResultKeys[0], sortedResultKeys[1]];
  }
}

function getBitsInPosition(report, pos) {
  const bitsInPosition = [];
  for (const numString of report) {
    bitsInPosition.push(numString[pos]);
  }
  return bitsInPosition;
}

function calcPowerConsumption(report) {
  let gamma = 0;
  let epsilon = 0;
  const numOfBits = report[0].length;
  for (let i = 0; i < numOfBits; i++) {
    const bitsInPosition = getBitsInPosition(report, i);
    const [leastCommon, mostCommon] = getLeastAndMostCommon(bitsInPosition);
    const shift = numOfBits - i - 1;
    gamma += +mostCommon << shift;
    epsilon += +leastCommon << shift;
  }
  return gamma * epsilon;
}

function calcGeneratorRating(report) {
  let generatorArr = report.slice();
  const numOfBits = report[0].length;
  for (let i = 0; i < numOfBits; i++) {
    if (generatorArr.length === 1) break;
    const bitsArr = getBitsInPosition(generatorArr, i);
    const [leastCommon, mostCommon] = getLeastAndMostCommon(bitsArr);
    generatorArr = generatorArr.filter((num) => {
      if (mostCommon === leastCommon) {
        return num[i] === "1";
      } else {
        return num[i] === mostCommon;
      }
    });
  }
  return parseInt(generatorArr[0], 2);
}

function calcScrubberRating(report) {
  let scrubberArr = report.slice();
  const numOfBits = report[0].length;
  for (let i = 0; i < numOfBits; i++) {
    if (scrubberArr.length === 1) break;
    const bitsArr = getBitsInPosition(scrubberArr, i);
    const [leastCommon, mostCommon] = getLeastAndMostCommon(bitsArr);
    scrubberArr = scrubberArr.filter((num) => {
      if (leastCommon === mostCommon) {
        return num[i] === "0";
      } else {
        return num[i] === leastCommon;
      }
    });
  }
  return parseInt(scrubberArr[0], 2);
}

function calcLifeSupportRating(report) {
  return calcGeneratorRating(report) * calcScrubberRating(report);
}

const testData = `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`
  .trim()
  .split("\n");
assert.equal(calcPowerConsumption(testData), 198);
assert.equal(calcLifeSupportRating(testData), 230);

const report = getLines("./03.txt");
console.log(calcPowerConsumption(report));
console.log(calcLifeSupportRating(report));
