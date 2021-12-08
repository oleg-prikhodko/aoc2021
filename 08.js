const assert = require("assert");
const { getLines, intersectSets, compareSets } = require("./util");

function parseEntriesFrom(lines) {
  return lines.map((line) => {
    const [signalPatterns, output] = line
      .split(" | ")
      .map((el) => el.split(" "));
    return { signalPatterns, output };
  });
}

function countUnique(entries) {
  const unique = entries
    .map((entry) => entry.output)
    .flat()
    .filter((output) => [2, 3, 4, 7].includes(output.length));
  return unique.length;
}

function calcOutputSum(entries) {
  return entries
    .map((entry) =>
      decodeOutput(findDigitSets(entry.signalPatterns), entry.output)
    )
    .reduce((acc, el) => acc + el);
}

function findDigitSets(signals) {
  const one = signals.find((el) => hasLen(el, 2));
  const four = signals.find((el) => hasLen(el, 4));
  const seven = signals.find((el) => hasLen(el, 3));
  const eight = signals.find((el) => hasLen(el, 7));
  const three = signals.find(
    (el) => hasLen(el, 5) && hasIntersectionSize(el, seven, 3)
  );
  const nine = signals.find(
    (el) => hasLen(el, 6) && hasIntersectionSize(el, four, 4)
  );
  const zero = signals.find(
    (el) => hasLen(el, 6) && el !== nine && hasIntersectionSize(el, seven, 3)
  );
  const six = signals.find((el) => hasLen(el, 6) && el !== nine && el !== zero);
  const five = signals.find(
    (el) => hasLen(el, 5) && hasIntersectionSize(el, six, 5)
  );
  const two = signals.find(
    (el) => hasLen(el, 5) && el !== three && el !== five
  );
  return [zero, one, two, three, four, five, six, seven, eight, nine].map(
    (el) => new Set(el)
  );
}

function hasLen(el, len) {
  return el.length === len;
}

function hasIntersectionSize(elA, elB, size) {
  return intersectSets(new Set(elA), new Set(elB)).size === size;
}

function decodeOutput(digitSets, output) {
  const outSets = output.map((el) => new Set(el));
  const result = outSets.map((outSet) =>
    digitSets.findIndex((digitSet) => compareSets(digitSet, outSet))
  );
  return parseInt(result.join(""));
}

const testLines = `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`
  .trim()
  .split("\n");

const testEntries = parseEntriesFrom(testLines);
assert.equal(countUnique(testEntries), 26);
assert.equal(calcOutputSum(testEntries), 61229);

const entries = parseEntriesFrom(getLines("./08.txt"));
console.log(countUnique(entries));
console.log(calcOutputSum(entries));
