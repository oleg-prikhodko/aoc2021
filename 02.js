const { getLines } = require("./util");

class CourseCalculator {
  constructor(lines) {
    this.lines = lines;
    this.horPos = 0;
    this.depth = 0;
  }

  run() {
    this.processInstructions();
    return this.horPos * this.depth;
  }

  processInstructions() {
    for (const line of this.lines) {
      let [, direction, units] = /(\w+) (\d+)/.exec(line);
      units = parseInt(units);
      this.updatePosition(direction, units);
    }
  }

  updatePosition(direction, units) {
    switch (direction) {
      case "up":
        this.depth -= units;
        break;
      case "down":
        this.depth += units;
        break;
      case "forward":
        this.horPos += units;
        break;
      default:
        throw new Error("Unknown command");
    }
  }
}

class ExtendedCourseCalculator extends CourseCalculator {
  constructor(lines) {
    super(lines);
    this.aim = 0;
  }

  updatePosition(direction, units) {
    switch (direction) {
      case "up":
        this.aim -= units;
        break;
      case "down":
        this.aim += units;
        break;
      case "forward":
        this.horPos += units;
        this.depth += this.aim * units;
        break;
      default:
        throw new Error("Unknown command");
    }
  }
}

const lines = getLines("./02.txt");
console.log(new CourseCalculator(lines).run());
console.log(new ExtendedCourseCalculator(lines).run());
