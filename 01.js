const { getLines } = require("./util");

function countIncreases(arr) {
  let count = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] < arr[i]) {
      count++;
    }
  }
  return count;
}

function getSlidingWindows(arr, n = 3) {
  const resultingArr = [];
  for (let i = 0; i <= arr.length - n; i++) {
    resultingArr.push(arr[i] + arr[i + 1] + arr[i + 2]);
  }
  return resultingArr;
}

const depths = getLines().map(Number);
console.log(countIncreases(depths));
console.log(countIncreases(getSlidingWindows(depths)));
