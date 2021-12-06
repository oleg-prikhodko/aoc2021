const { getLines } = require("./util");

function getPointsInLine({ start, end }) {
  const [xStart, yStart] = start;
  const [xEnd, yEnd] = end;
  const xStep = xEnd === xStart ? 0 : xEnd > xStart ? 1 : -1;
  const yStep = yEnd === yStart ? 0 : yEnd > yStart ? 1 : -1;
  let x = xStart;
  let y = yStart;
  const points = [];
  while (x !== xEnd || y !== yEnd) {
    points.push([x, y]);
    x += xStep;
    y += yStep;
  }
  points.push([xEnd, yEnd]);
  return points;
}

function parseLines() {
  return getLines("./05.txt").map((str) => {
    const lineRegex = /(\d+),(\d+) -> (\d+),(\d+)/;
    const [, xStart, yStart, xEnd, yEnd] = lineRegex.exec(str);
    return { start: [+xStart, +yStart], end: [+xEnd, +yEnd] };
  });
}

function horAndVertLinesOnly(line) {
  return line.start[0] === line.end[0] || line.start[1] === line.end[1];
}

function run(filterFn = () => true) {
  const lines = parseLines();
  const diagram = {};
  lines
    .filter(filterFn)
    .map(getPointsInLine)
    .forEach((linePoints) => {
      for (const point of linePoints) {
        if (diagram[point]) {
          diagram[point]++;
        } else {
          diagram[point] = 1;
        }
      }
    });
  console.log(Object.values(diagram).filter((value) => value >= 2).length);
}

run(horAndVertLinesOnly);
run();
