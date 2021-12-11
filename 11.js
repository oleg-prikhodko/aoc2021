const assert = require("assert");
const fs = require("fs");

class Simulation {
  constructor(points, size = 10) {
    this.initial = points;
    this.points = points;
    this.size = size;
    this.flashCount = 0;
  }

  calcFlashCountAfter(steps) {
    this.reset();
    for (let i = 0; i < steps; i++) {
      this.tick();
    }
    return this.flashCount;
  }

  calcFirstStep() {
    this.reset();
    let step = 0;
    while (!this.points.every((point) => point === 0)) {
      this.tick();
      step++;
    }
    return step;
  }

  reset() {
    this.points = this.initial;
    this.flashCount = 0;
  }

  tick() {
    this.nextState = this.points.map((point) => point + 1);
    this.readyToFlash = this.nextState
      .map((_, index) => index)
      .filter((index) => this.nextState[index] > 9);
    this.flashed = new Set();

    while (this.readyToFlash.length) {
      const index = this.readyToFlash.pop();
      this.flash(index);
    }

    this.points = this.nextState;
  }

  flash(index) {
    const adjacentIndexes = this.getAdjacentIndexes(index);
    this.nextState[index] = 0;
    this.flashed.add(index);
    this.flashCount++;
    for (const adjacentIndex of adjacentIndexes) {
      if (
        this.nextState[adjacentIndex] <= 9 &&
        !this.flashed.has(adjacentIndex)
      ) {
        this.nextState[adjacentIndex]++;
        if (this.nextState[adjacentIndex] > 9) {
          this.readyToFlash.push(adjacentIndex);
        }
      }
    }
  }

  getAdjacentIndexes(index) {
    const row = Math.floor(index / this.size);
    const col = index % this.size;
    const adjacent = [];

    if (col > 0) {
      adjacent.push(index - 1);
    }
    if (row > 0) {
      adjacent.push(index - this.size);
    }
    if (col > 0 && row > 0) {
      adjacent.push(index - this.size - 1);
    }
    if (row > 0 && col < this.size - 1) {
      adjacent.push(index - this.size + 1);
    }
    if (col < this.size - 1) {
      adjacent.push(index + 1);
    }
    if (row < this.size - 1) {
      adjacent.push(index + this.size);
    }
    if (col > 0 && row < this.size - 1) {
      adjacent.push(index + this.size - 1);
    }
    if (col < this.size - 1 && row < this.size - 1) {
      adjacent.push(index + this.size + 1);
    }

    return adjacent;
  }
}

function getPointsFrom(data) {
  return data
    .trim()
    .split("\n")
    .map((line) => line.split(""))
    .flat()
    .map(Number);
}

const testData = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;
const testSim = new Simulation(getPointsFrom(testData));
assert.equal(testSim.calcFlashCountAfter(100), 1656);
assert.equal(testSim.calcFirstStep(), 195);

const sim = new Simulation(getPointsFrom(fs.readFileSync("./11.txt", "utf8")));
console.log(sim.calcFlashCountAfter(100));
console.log(sim.calcFirstStep());
