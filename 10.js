const { getLines } = require("./util");
const assert = require("assert");

const symbols = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const symbolPoints = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const completionPoints = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

function calcScores(damagedLines) {
  const illegalSymbols = [];
  const completions = [];
  for (const damagedLine of damagedLines) {
    try {
      const completion = visitChunks(damagedLine);
      if (completion.length) {
        completions.push(completion);
      }
    } catch (e) {
      illegalSymbols.push(e.message);
    }
  }

  const syntaxErrorScore = illegalSymbols.reduce(
    (acc, symbol) => acc + symbolPoints[symbol],
    0
  );
  const completionIndex = Math.floor(completions.length / 2);
  const completionScore = completions
    .map(calcCompletionPoints)
    .sort((a, b) => a - b)[completionIndex];
  return [syntaxErrorScore, completionScore];
}

function visitChunks(line) {
  const completion = [];

  const _visit = (index) => {
    const firstSymbol = line[index];
    let nextIndex = index + 1;
    let nextSymbol = line[nextIndex];
    while (nextSymbol !== symbols[firstSymbol]) {
      if (nextSymbol in symbols) {
        const diff = _visit(nextIndex);
        nextIndex += diff;
        nextSymbol = line[nextIndex];
      } else if (nextSymbol === undefined) {
        completion.push(symbols[firstSymbol]);
        return nextIndex - index + 1;
      } else {
        throw new Error(nextSymbol);
      }
    }
    return nextIndex - index + 1;
  };

  let index = 0;
  while (index < line.length) {
    const diff = _visit(index);
    index += diff;
  }

  return completion;
}

function calcCompletionPoints(symbols) {
  let score = 0;
  for (const symbol of symbols) {
    score *= 5;
    score += completionPoints[symbol];
  }
  return score;
}

const testLines = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`
  .trim()
  .split("\n");

const testScores = calcScores(testLines);
assert.equal(testScores[0], 26397);
assert.equal(testScores[1], 288957);

const damagedLines = getLines("./10.txt");
console.log(calcScores(damagedLines));
