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
  const regex = new RegExp(/[^0-9\.]/);
  return !!char.match(regex);
};

const getNeighbourCoordinates = (match, rowIndex, matrix) => {
  const matrixWidth = matrix[0].length - 1;
  const matrixHeight = matrix.length - 1;

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

  // Filter out indices that don't exist (for matches on sides of matrix)
  return neighbourCoords.filter(([row, col]) => {
    return row >= 0 && row <= matrixHeight && col >= 0 && col <= matrixWidth;
  });
};

const hasSymbolNeighbour = (match, rowIndex, matrix) => {
  for (let [row, col] of getNeighbourCoordinates(match, rowIndex, matrix)) {
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

const totalAllGearRatios = (matrix) => {
  /* 
  Key uniquely identifies the * via coordinates "xy"
  Value holds an array of all part numbers that neighbour the *
  {
    "85": [598, 755]
    "13": [35, 467] 
    "43": [617]
  }
  We sum the array products of all values with a length of 2
  */
  const starNeighbours = {};

  for (let i = 0; i < matrix.length; i++) {
    const partNumberMatches = getNumberMatches(matrix[i]).filter((match) =>
      hasSymbolNeighbour(match, i, matrix)
    );

    for (let match of partNumberMatches) {
      const starNeighbourCoords = getNeighbourCoordinates(
        match,
        i,
        matrix
      ).filter(([row, col]) => matrix[row][col] === "*");

      for (let [row, col] of starNeighbourCoords) {
        if (starNeighbours[`${row}${col}`]) {
          starNeighbours[`${row}${col}`].push(Number(match[0]));
        } else {
          starNeighbours[`${row}${col}`] = [Number(match[0])];
        }
      }
    }
  }

  return Object.values(starNeighbours)
    .filter((numbers) => numbers.length === 2)
    .map((numbers) => numbers.reduce((a, b) => a * b, 1))
    .reduce((a, b) => a + b);
};

// Tests
describe("solution", () => {
  it("should return the correct answer for part 1 mock", () => {
    expect(totalAllMatchesWithSymbolNeighbours(mock1)).toBe(4361);
  });
  it("should return the correct answer for part 2 mock", () => {
    expect(totalAllGearRatios(mock1)).toBe(467835);
  });
});

// Answers
console.log("Part 1:", totalAllMatchesWithSymbolNeighbours(input)); // 543867
console.log("Part 2:", totalAllGearRatios(input)); // 79613331
