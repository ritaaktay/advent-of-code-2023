const { readFileSync } = require("fs");

// Inputs
const mock1 = readFileSync("./day-2/mock-1.txt").toString().split("\n");
const input = readFileSync("./day-2/input-1.txt").toString().split("\n");

// Solutions
const colors = ["red", "green", "blue"];

const getColorRegex = (color) => {
  return new RegExp(`(: |, |; )(\\d+) ${color}`, "g");
};

const getMinimumForColor = (game, color) => {
  minimumMatchIndex = 2;
  const matches = Array.from(game.matchAll(getColorRegex(color))).map((match) =>
    Number(match[minimumMatchIndex])
  );
  return Math.max(...matches);
};

const gameIsPossible = (game) => {
  const limits = {
    red: 12,
    green: 13,
    blue: 14,
  };

  for (let color of colors) {
    const minimumForColor = getMinimumForColor(game, color);
    if (minimumForColor > limits[color]) return false;
  }

  return true;
};

const getPossibleGameIdsTotal = (games) => {
  return games
    .filter(gameIsPossible)
    .map((game) => {
      return Number(game.match(/Game (\d+)/)[1]);
    })
    .reduce((a, b) => a + b);
};

const getPowersOfAllGameLimits = (games) => {
  return games
    .map((game) => {
      return colors.map((color) => {
        return getMinimumForColor(game, color);
      });
    })
    .map((limitsForAllColors) => limitsForAllColors.reduce((a, b) => a * b, 1))
    .reduce((a, b) => a + b);
};

// Tests
describe("solution", () => {
  it("should return the correct answer for mock 1", () => {
    expect(getPossibleGameIdsTotal(mock1)).toBe(8);
  });
  it("should return the correct answer for mock 2", () => {
    expect(getPowersOfAllGameLimits(mock1)).toBe(2286);
  });
});

// Answers
console.log("Part 1:", getPossibleGameIdsTotal(input)); // 2771
console.log("Part 2:", getPowersOfAllGameLimits(input)); // 70924
