const fs = require("fs");
const assert = require("assert");

function parseData(data) {
  const [pointLines, foldLines] = data
    .trim()
    .split("\n\n")
    .map((lines) => lines.split("\n"));
  const points = new Set(pointLines);
  const folds = foldLines.map((line) => {
    const [, axis, dimension] = /(\w+)=(\d+)/.exec(line);
    return { axis, dimension: +dimension };
  });
  return [points, folds];
}

function run(points, folds) {
  let nextPoints = points;
  for (const foldInfo of folds) {
    nextPoints = fold(nextPoints, foldInfo);
  }
  displayPoints(nextPoints);
}

function fold(points, foldInfo) {
  const { axis, dimension } = foldInfo;
  const nextPoints = new Set();
  for (const point of points.values()) {
    const [x, y] = point.split(",").map(Number);
    if (axis === "x") {
      if (x > dimension) {
        nextPoints.add(`${x - (x - dimension) * 2},${y}`);
      } else {
        nextPoints.add(point);
      }
    } else {
      if (y > dimension) {
        nextPoints.add(`${x},${y - (y - dimension) * 2}`);
      } else {
        nextPoints.add(point);
      }
    }
  }
  return nextPoints;
}

function displayPoints(points) {
  const displayArr = [];
  for (const point of points.values()) {
    const [x, y] = point.split(",").map(Number);
    if (!displayArr[y]) {
      displayArr[y] = [];
    }
    displayArr[y][x] = "#";
  }
  console.table(displayArr);
}

const testData = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;
const [testPoints, testFolds] = parseData(testData);
assert.equal(fold(testPoints, testFolds[0]).size, 17);

const [points, folds] = parseData(fs.readFileSync("./13.txt", "utf8"));
console.log(fold(points, folds[0]).size);
run(points, folds);
