const { mock1 } = require("./mock-1");
const { mock2 } = require("./mock-2");
const { input1 } = require("./input-1");
const { input2 } = require("./input-2");

// Solutions

const getLowerLimit = (race) => {
  for (let s = 1; s < race.time; s++) {
    const distance = (race.time - s) * s;
    if (distance > race.distance) {
      return s;
    }
  }
};

const getRaceOptions = (race) => {
  const lower = getLowerLimit(race);
  const mid = race.time / 2;
  const upper = mid + (mid - lower);
  return upper - lower + 1;
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

console.log("Part 1:", multiplyRaceOptions(input1)); // 220320

console.log("Part 2:", getRaceOptions(input2)); // 34454850

/* 
race: { time, distance}
Winning option needs to be greater than distance in time allowed

Ex. 
{ time: 7, distance: 9 },
Hold 0, (7 - 0) * 0 = 0
Hold 1, (7 - 1) * 1 = 6
Hold 2, (7 - 2) * 2 = 10
Hold 3, (7 - 3 ) * 3 = 12
Hold 4, (7 - 4) * 4 = 12
Hold 5, (7 - 5) * 5 = 10
Hold 6, (7 - 6) * 6 = 6 
Hold 7, (7 - 7) * 7 = 0

Brute force approach => approx. 20 seconds
Look at each option (for all seconds from 1 to time - 1) 
and count winning options

More optimal approaches => approx. 0.2 seconds (100x faster)
It's symettrical, so we can just look at the first half
Find lower limit (via loop), find upper limit (via symmetry)
Take their difference (plus +1 because limits are inclusive)
The same symmetry applies to both even & odd time limit:
mid + ( mid - lower limit ) = upper limit
*/
