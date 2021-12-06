const fs = require("fs");

module.exports.getLines = function (filename) {
  return fs.readFileSync(filename, "utf8").trim().split("\n");
};
