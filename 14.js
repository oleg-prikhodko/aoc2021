const assert = require("assert");
const fs = require("fs");

function parse(data) {
  const [sequence, mapLines] = data.trim().split("\n\n");
  const map = {};
  for (const line of mapLines.split("\n")) {
    const [key, val] = line.split(" -> ");
    map[key] = val;
  }
  return [sequence, map];
}

function run(seq, map, steps = 10) {
  let last = seq.slice(-2);
  let pairs = new Map();
  for (const pair of getPairs(seq)) {
    pairs.set(pair, (pairs.get(pair) ?? 0) + 1);
  }
  for (let i = 0; i < steps; i++) {
    pairs = grow(pairs, map);
    last = transform(last, map)[1];
  }
  return getLeastMostCommonDiff(pairs, last);
}

function grow(pairs, map) {
  const nextPairs = new Map();
  for (const pair of pairs.keys()) {
    const count = pairs.get(pair);
    const [pairA, pairB] = transform(pair, map);
    nextPairs.set(pairA, (nextPairs.get(pairA) ?? 0) + count);
    nextPairs.set(pairB, (nextPairs.get(pairB) ?? 0) + count);
  }
  return nextPairs;
}

function transform(pair, map) {
  return [pair[0] + map[pair], map[pair] + pair[1]];
}

function* getPairs(str) {
  for (let i = 0; i < str.length - 1; i++) {
    yield str[i] + str[i + 1];
  }
}

function getLeastMostCommonDiff(pairs, last) {
  const counter = new Map();
  for (const pair of pairs.keys()) {
    const char = pair[0];
    counter.set(char, (counter.get(char) ?? 0) + pairs.get(pair));
    if (pair === last) {
      const lastChar = last[1];
      counter.set(lastChar, (counter.get(lastChar) ?? 0) + 1);
    }
  }
  const sorted = Array.from(counter.keys()).sort(
    (a, b) => counter.get(a) - counter.get(b)
  );
  return counter.get(sorted[sorted.length - 1]) - counter.get(sorted[0]);
}

const testData = `
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;
const [testSeq, testMap] = parse(testData);
assert.equal(run(testSeq, testMap), 1588);
assert.equal(run(testSeq, testMap, 40), 2188189693529);

const [seq, map] = parse(fs.readFileSync("./14.txt", "utf8"));
console.log(run(seq, map));
console.log(run(seq, map, 40));
