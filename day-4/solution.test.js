const { readFileSync } = require("fs");

// Inputs
const mock = readFileSync("./day-4/mock-1.txt").toString().split("\n");
const input = readFileSync("./day-4/input-1.txt").toString().split("\n");

// Solutions
/* 
  Card:
  {
    need: [ '41', '48' ]
    have: [ '34', '41' ]
    matches: 1
    copies: 1
  }
*/
const parseCards = (input) => {
  return input.map((line) => {
    const parts = line
      .split(":")[1]
      .split("|")
      .map((group) =>
        group
          .trim()
          .split(" ")
          .filter((num) => num !== "")
      );
    return {
      need: parts[0],
      have: parts[1],
      matches: parts[0].filter((num) => parts[1].includes(num)).length,
      copies: 1,
    };
  });
};

/*
  1 match, 1 point
  2 matches, 1 * 2 = 2 points
  3 matches, 1 * 2 * 2 = 4 points 
*/
const getPointsForMatches = (match) => {
  if (!match) return 0;
  return 1 * Math.pow(2, match - 1);
};

const getTotalPointsForCards = (cards) => {
  return cards.reduce((total, card) => {
    return total + getPointsForMatches(card.matches);
  }, 0);
};

const getTotalCards = (cards) => {
  for (let i = 0; i < cards.length; i++) {
    /* 
      Loop through next X cards,
      Where X is the number of matches for the current card
    */
    for (let x = i + 1; x <= i + cards[i].matches; x++) {
      // Increment copy amount by one for each copy of current card
      cards[x].copies += cards[i].copies;
    }
  }
  return cards.reduce((total, card) => (total += card.copies), 0);
};

// Tests
describe("solution", () => {
  it("should return the correct answer for part 1 mock", () => {
    expect(getTotalPointsForCards(parseCards(mock))).toBe(13);
  });
  it("should return the correct answer for part 2 mock", () => {
    expect(getTotalCards(parseCards(mock))).toBe(30);
  });
});

// Answers
console.log("Part 1:", getTotalPointsForCards(parseCards(input)));
console.log("Part 2:", getTotalCards(parseCards(input)));
