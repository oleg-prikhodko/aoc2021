const fs = require("fs");
const assert = require("assert");

function parseData(data) {
  const lines = data.trim().split("\n");
  const map = {};
  for (const line of lines) {
    const [start, end] = line.split("-");
    map[start] ? map[start].push(end) : (map[start] = [end]);
    if (start !== "start") {
      map[end] ? map[end].push(start) : (map[end] = [start]);
    }
  }
  delete map.end;
  return map;
}

function isSmall(point) {
  return point.toLowerCase() === point;
}

class VisitCounter {
  constructor(visitCounter) {
    if (visitCounter) {
      this.visited = new Map(visitCounter.visited);
    } else {
      this.visited = new Map();
    }
  }

  hasVisitedTwice() {
    return (
      Array.from(this.visited.values()).find((val) => val === 2) !== undefined
    );
  }

  has(point) {
    return this.hasVisitedTwice() && this.visited.has(point);
  }

  add(point) {
    this.visited.set(point, (this.visited.get(point) ?? 0) + 1);
  }
}

function calcPaths(map, Visited = Set) {
  const paths = [];

  const visit = (point, path, visited) => {
    if (point === "end") {
      paths.push([...path, point]);
      return;
    } else if (visited.has(point)) {
      return;
    }
    const _path = [...path, point];
    const _visited = new Visited(visited);
    if (isSmall(point)) {
      _visited.add(point);
    }
    for (const nextPoint of map[point]) {
      visit(nextPoint, _path, _visited);
    }
  };

  visit("start", [], new Visited());

  return paths;
}

const testData = `
fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;
const testMap = parseData(testData);
assert.equal(calcPaths(testMap).length, 226);
assert.equal(calcPaths(testMap, VisitCounter).length, 3509);

const map = parseData(fs.readFileSync("./12.txt", "utf8"));
console.log(calcPaths(map).length);
console.log(calcPaths(map, VisitCounter).length);
