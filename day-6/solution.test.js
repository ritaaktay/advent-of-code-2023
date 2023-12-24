const { mock1 } = require("./mock-1");
const { mock2 } = require("./mock-2");
const { input1 } = require("./input-1");
const { input2 } = require("./input-2");

// Solutions

/* 
{ time, distance}
Winning option needs to be greater than distance in time allowed
Get the multiplication of total number of winning options per race

Ex. 
{ time: 7, distance: 9 },
Hold 1, (7 - 1) * 1 = 6
Hold 2, (7 - 2) * 2 = 10
Hold 3, (7 - 3 ) * 3 = 12
Hold 4, (7 - 4) * 4 = 12
Hold 5, (7 - 5) * 5 = 10
Hold 6, (7 - 6) * 6 = 6 

Brute force approach =>
Look at each option (for all seconds from 1 to time - 1) and count

More optimal approach => 
(It's symettrical, so we can just look at the first half)

Find at least => Bit where it goes above the distance needed (ex. 2, 10)
Find no more than => Bit where it drops back below (ex. 5, 10)
Find the difference 
*/

const getRaceOptions = (race) => {
  let count = 0;
  for (let s = 1; s < race.time; s++) {
    distance = (race.time - s) * s;
    if (distance > race.distance) count++;
  }
  return count;
};

const multiplyRaceOptions = (races) => {
  return races.reduce((acc, race) => {
    return acc * getRaceOptions(race);
  }, 1);
};

// Tests

describe("solution", () => {
  it("should return the correct answer for part 1 mock", () => {
    expect(multiplyRaceOptions(mock1)).toBe(288);
  });

  it("should return the correct answer for part 2 mock", () => {
    expect(getRaceOptions(mock2)).toBe(71503);
  });
});

// Answers

console.log("Part 1:", multiplyRaceOptions(input1));
console.log("Part 2:", getRaceOptions(input2));
