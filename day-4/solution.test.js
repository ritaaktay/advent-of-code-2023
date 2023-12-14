const { group } = require("console");
const { readFileSync } = require("fs");
const { parse } = require("path");

// Inputs
const mock = readFileSync("./day-4/mock-1.txt").toString().split("\n");
const input = readFileSync("./day-4/input-1.txt").toString().split("\n");

// Solutions
/* 
  Card:
  {
    need: [ '41', '48' ] // index 0 = winning numbers
    have: [ '34', '41' ] // index 1 = numbers posessed
    matches: 1
    copies: 1
  }
*/
const parseCards = (cards) => {
  return cards.map((card) => {
    const parts = card
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
  i => number of matches
  0 => points doubled for each match 
    ex. 1 match, 1 point
        2 matches 1 * 2 = 2 points
        3 matches 1 * 2 * 2 = 4 points 
*/
const getPointsForMatchAmount = (matchAmount) => {
  if (matchAmount === 0) return 0;
  let total = 1;
  for (let i = 1; i < matchAmount; i++) {
    total *= 2;
  }
  return total;
};

const getTotalPointsForCards = (cards) => {
  return cards.reduce((total, card) => {
    return total + getPointsForMatchAmount(card.matches);
  }, 0);
};

const getScratchCardAmount = (cards) => {
  for (let i = 0; i < cards.length; i++) {
    // Loop through the next X cards
    // Where X is the number of matches for current card
    for (let x = i + 1; x <= i + cards[i].matches; x++) {
      // Increment copies by one for each copy of current card
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
    expect(getScratchCardAmount(parseCards(mock))).toBe(30);
  });
});

// Answers
console.log("Part 1:", getTotalPointsForCards(parseCards(input)));
console.log("Part 2:", getScratchCardAmount(parseCards(input)));
