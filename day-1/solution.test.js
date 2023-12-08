const { readFileSync } = require("fs");

// Inputs
const mock1 = readFileSync("./day-1/mock-1.txt").toString().split("\n");
const mock2 = readFileSync("./day-1/mock-2.txt").toString().split("\n");
const input = readFileSync("./day-1/input-1.txt").toString().split("\n");

// Solutions
const digits = [
  [1, "one"],
  [2, "two"],
  [3, "three"],
  [4, "four"],
  [5, "five"],
  [6, "six"],
  [7, "seven"],
  [8, "eight"],
  [9, "nine"],
];

const getFirstAndLast = (line, useDigitsOnly) => {
  let first = { index: line.length, number: 0 };
  let last = { index: -1, number: 0 };

  for (let [number, string] of digits) {
    const regex = new RegExp(
      `${useDigitsOnly ? `` : `${string}|`}${number}`,
      "g"
    );

    const matches = Array.from(line.matchAll(regex));

    if (matches.length === 0) continue;

    if (matches[0].index < first.index) {
      first = { index: matches[0].index, number };
    }

    lastMatch = matches[matches.length - 1];
    if (lastMatch.index > last.index) {
      last = { index: lastMatch.index, number };
    }
  }

  return Number(`${first.number}${last.number}`);
};

const solution = (lines, useDigitsOnly) => {
  return lines
    .map((line) => getFirstAndLast(line, useDigitsOnly))
    .reduce((a, b) => a + b);
};

// Tests
describe("solution", () => {
  it("should return the correct answer for mock 1", () => {
    expect(solution(mock1, true)).toBe(142);
  });
  it("should return the correct answer for mock 2", () => {
    expect(solution(mock2, false)).toBe(281);
  });
});

// Answers
console.log("Part 1:", solution(input, true));
console.log("Part 2:", solution(input, false));
