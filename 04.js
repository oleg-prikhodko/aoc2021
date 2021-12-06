const fs = require("fs");

class Game {
  constructor() {
    const contents = fs.readFileSync("./04.txt", "utf8");
    let [nums, ...boards] = contents.trim().split("\n\n");
    this.nums = nums.split(",").map(Number);
    this.boards = boards.map((contents) => new Board(contents));
  }

  run() {
    for (const num of this.nums) {
      for (const board of this.boards) {
        const result = board.nextNum(num);
        if (result) {
          return this.calcBoardScore(board, num);
        }
      }
    }
  }

  calcBoardScore(board, lastNum) {
    return (
      lastNum *
      Object.keys(board.nums)
        .filter((num) => !board.nums[num].marked)
        .map(Number)
        .reduce((acc, num) => acc + num)
    );
  }
}

class ExtendedGame extends Game {
  constructor() {
    super();
  }

  run() {
    for (const num of this.nums) {
      for (const board of this.boards) {
        if (board.won) continue;
        const result = board.nextNum(num);
        if (result) {
          if (this.remainingBoards() === 0) {
            return this.calcBoardScore(board, num);
          }
        }
      }
    }
  }

  remainingBoards() {
    return this.boards.reduce((acc, board) => {
      return board.won ? acc - 1 : acc;
    }, this.boards.length);
  }
}

class Board {
  constructor(contents) {
    this.won = false;
    this.size = 5;
    this.nums = {};
    this.scores = { rows: {}, cols: {} };
    for (const [rowIndex, line] of contents.split("\n").entries()) {
      const numsInLine = line.trim().replace(/\s+/g, " ").split(" ");
      for (const [colIndex, num] of numsInLine.entries()) {
        this.nums[num] = { row: rowIndex, col: colIndex, marked: false };
      }
    }
  }

  nextNum(num) {
    if (num in this.nums) {
      this.nums[num].marked = true;
      const { row, col } = this.nums[num];
      if (this.scores.rows[row]) {
        this.scores.rows[row]++;
        if (this.scores.rows[row] === this.size) {
          this.won = true;
        }
      } else {
        this.scores.rows[row] = 1;
      }
      if (this.scores.cols[col]) {
        this.scores.cols[col]++;
        if (this.scores.cols[col] === this.size) {
          this.won = true;
        }
      } else {
        this.scores.cols[col] = 1;
      }
    }
    return this.won;
  }
}

console.log(new Game().run());
console.log(new ExtendedGame().run());
