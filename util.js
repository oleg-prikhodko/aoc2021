const fs = require("fs");

module.exports.getLines = function (filename) {
  return fs.readFileSync(filename, "utf8").trim().split("\n");
};

/**
 * @param {Set} setA
 * @param {Set} setB
 */
module.exports.intersectSets = function (setA, setB) {
  const result = new Set();
  for (const element of setA.values()) {
    if (setB.has(element)) {
      result.add(element);
    }
  }
  return result;
};

/**
 * @param {Set} setA
 * @param {Set} setB
 */
module.exports.compareSets = function (setA, setB) {
  if (setA.size !== setB.size) return false;
  for (const el of setA) {
    if (!setB.has(el)) return false;
  }
  return true;
};
