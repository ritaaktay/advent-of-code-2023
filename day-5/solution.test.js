const { readFileSync } = require("fs");

// Inputs
const mock = readFileSync("./day-5/mock-1.txt").toString();
const input = readFileSync("./day-5/input-1.txt").toString();

// Solutions
/*
  i => string:
  seed-to-soil map:
  50 98 2
  52 50 48
  o => maps: 
  [
    [ { source, destination, range }, { source, destination, range }]
    [ { source, destination, range }, { source, destination, range }]
    [ { source, destination, range }, { source, destination, range }]
  ]
*/
const parseMaps = (input) => {
  return Array.from(input.matchAll(/:([\d\s\n]+)/g)).map((m) =>
    m[1]
      .trim()
      .split("\n")
      .map((line) => {
        const nums = line.split(" ");
        return {
          source: parseInt(nums[1]),
          destination: parseInt(nums[0]),
          range: parseInt(nums[2]),
        };
      })
  );
};

/* 
  i => source, map: [{ source, destination, range }]
  0 => destination

  For each conversion in map
    If source point is in source range
    Return destination point
  (If source point is in no source range)
  Return source point
*/
const getSourceToDestination = (source, map) => {
  for (let conversion of map) {
    const diff = source - conversion.source;
    if (diff <= conversion.range && diff >= 0) {
      return conversion.destination + diff;
    }
  }
  return source;
};

/*
  i =>  seeds: [ 79, 14, 55, 13 ], maps
  o =>  lowest location

  Reduce maps to final destination array
    Acc starts with seeds as first source array
    For each map
      Convert source array to destination array
      Return as source array for next map
  Return min of final destination array
*/
const getLowestLocation = (seeds, maps) => {
  return Math.min(
    ...maps.reduce((sources, map) => {
      return sources.map((source) => getSourceToDestination(source, map));
    }, seeds)
  );
};

// Tests
describe("solution", () => {
  it("should return the correct answer for part 1 mock", () => {
    expect(getLowestLocation([79, 14, 55, 13], parseMaps(mock))).toBe(35);
  });
  it("should return the correct answer for part 2 mock", () => {
    expect().toBe();
  });
});

const seeds = [
  4121823, 421491713, 1255413673, 350530906, 944138913, 251104806, 481818804,
  233571979, 2906248740, 266447632, 3454130719, 50644329, 1920342932, 127779721,
  2109326496, 538709762, 3579244700, 267233350, 4173137165, 60179884,
];

// Answers
console.log("Part 1:", getLowestLocation(seeds, parseMaps(input)));
console.log("Part 2:");

// Notes
/*
  The numbers are big
  But it is about the relationships between numbers
  So maybe that can be enough to get the answer?
*/
