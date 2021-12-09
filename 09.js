const assert = require("assert");
const fs = require("fs");

class RiskCalculator {
  constructor(data) {
    const heightMap = data.trim().split("\n");
    this.sizeX = heightMap[0].length;
    this.sizeY = heightMap.length;
    this.heights = heightMap
      .map((values) => values.split("").map(Number))
      .flat();
  }

  calcRiskLevelSum() {
    const lowPoints = this.calcLowPointIndexes().map(
      (index) => this.heights[index]
    );
    return lowPoints.reduce((acc, lowPoint) => lowPoint + 1 + acc, 0);
  }

  calcLowPointIndexes() {
    this.lowPointIndexes = [];
    for (let i = 0; i < this.heights.length; i++) {
      const point = this.heights[i];
      const adjacentIndexes = this.getAdjacentIndexes(i);
      if (adjacentIndexes.every((index) => this.heights[index] > point)) {
        this.lowPointIndexes.push(i);
      }
    }
    return this.lowPointIndexes;
  }

  getAdjacentIndexes(index) {
    const [row, col] = this.getRowCol(index);
    const adjacent = [];
    if (row > 0) {
      adjacent.push(index - this.sizeX);
    }
    if (row < this.sizeY - 1) {
      adjacent.push(index + this.sizeX);
    }
    if (col > 0) {
      adjacent.push(index - 1);
    }
    if (col < this.sizeX - 1) {
      adjacent.push(index + 1);
    }
    return adjacent;
  }

  getRowCol(index) {
    const row = Math.floor(index / this.sizeX);
    const col = index % this.sizeX;
    return [row, col];
  }

  calcBasinsProduct() {
    const largestBasins = this.lowPointIndexes
      .map((index) => this.getBasin(index).size)
      .sort((a, b) => b - a)
      .slice(0, 3);
    return largestBasins.reduce((acc, size) => acc * size);
  }

  getBasin(index) {
    const basin = new Set();
    const _getBasin = (index) => {
      const adjacentIndexes = this.getAdjacentIndexes(index).filter(
        (index) => this.heights[index] < 9 && !basin.has(index)
      );
      if (adjacentIndexes.length) {
        adjacentIndexes.forEach((index) => basin.add(index));
        adjacentIndexes.forEach(_getBasin);
      }
    };
    _getBasin(index);
    return basin;
  }
}

const testData = `
2199943210
3987894921
9856789892
8767896789
9899965678`;
const testCalc = new RiskCalculator(testData);
assert.equal(testCalc.calcRiskLevelSum(), 15);
assert.equal(testCalc.calcBasinsProduct(), 1134);

const data = fs.readFileSync("./09.txt", "utf8");
const riskCalc = new RiskCalculator(data);
console.log(riskCalc.calcRiskLevelSum());
console.log(riskCalc.calcBasinsProduct());
