const { match } = require("assert");
const { readFileSync } = require("fs");

// Inputs
const mock1 = readFileSync("./day-3/mock-1.txt").toString().split("\n");
const input = readFileSync("./day-3/input-1.txt").toString().split("\n");

// Solutions
const getNumberMatches = (row) => {
  const regex = new RegExp("\\d+", "g");
  return Array.from(row.matchAll(regex));
};

const isSymbol = (char) => {
  if (!char) return false;
  const regex = new RegExp(/[^0-9\.]/);
  return !!char.match(regex);
};

const getNeighbourCoordinates = (
  match,
  rowIndex,
  matrixWidth,
  matrixHeight
) => {
  const matchStart = match.index;
  const matchEnd = matchStart + match[0].length - 1;

  // Start with left & right neighbours
  const neighbourCoords = [
    [rowIndex, matchStart - 1],
    [rowIndex, matchEnd + 1],
  ];

  // Loop including -1 & +1 of the match column ex. ".123."
  // Thus top & bottom neighbours also cover corner neighbours
  for (let i = matchStart - 1; i <= matchEnd + 1; i++) {
    if (rowIndex > 0) neighbourCoords.push([rowIndex - 1, i]);
    if (rowIndex < matrixHeight) neighbourCoords.push([rowIndex + 1, i]);
  }

  // Filter out indices that don't exist (for matches on sides)
  return neighbourCoords.filter(([row, col]) => {
    return row >= 0 && row <= matrixHeight && col >= 0 && col <= matrixWidth;
  });
};

const hasSymbolNeighbour = (match, rowIndex, matrix) => {
  const matrixWidth = matrix[rowIndex].length;
  const matrixHeight = matrix.length - 1;

  for (let [row, col] of getNeighbourCoordinates(
    match,
    rowIndex,
    matrixWidth,
    matrixHeight
  )) {
    if (isSymbol(matrix[row][col])) return true;
  }
  return false;
};

const totalAllMatchesWithSymbolNeighbours = (matrix) => {
  return matrix
    .map((row, index) => {
      return getNumberMatches(row)
        .filter((match) => hasSymbolNeighbour(match, index, matrix))
        .map((match) => Number(match[0]))
        .reduce((a, b) => a + b, 0);
    })
    .reduce((a, b) => a + b, 0);
};

// Tests
describe("solution", () => {
  it("should return the correct answer for mock 1", () => {
    expect(totalAllMatchesWithSymbolNeighbours(mock1)).toBe(4361);
  });
  it("should return the correct answer for mock 2", () => {
    expect().toBe();
  });
});

// Answers
console.log("Part 1:", totalAllMatchesWithSymbolNeighbours(input));
// console.log("Part 2:");
