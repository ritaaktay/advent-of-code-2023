const { readFileSync } = require("fs");

// Inputs

const mock = readFileSync("./day-5/mock-1.txt").toString();
const input = readFileSync("./day-5/input-1.txt").toString();

// Notes

/* 
I cannot consider each seed individually because the range of the seeds is too large.
Since the relationships are all described as ranges, I can compare the ranges to each other instead.
When I am dealing with ranges I will only be dealing with the delimiting numbers, not the numbers in between.

We need to:

- Convert the source ranges to destination ranges,
   Iteratively for all maps where,
   One map's destination ranges are the next map's source ranges
- Get the start of the lowest final destination range

The only tricky part is, a source range can correspond to multiple conversions of a map,
or some parts of the range might not be in the map at all.
So ranges will have to break up into multiple ranges;
We'll need to perform intersection, subtraction and conversion on ranges.
*/

// Parsing

/*
i =>  string: 
      " dest start, src start, range
        dest start, src start, range "
      
o =>  maps:
      [
        [ { src: { start, end }, dst: {  start, end }
          { src: { start, end }, dst: {  start, end } ], 
        [ { src: { start, end }, dst: {  start, end }
          { src: { start, end }, dst: {  start, end } ]
      ]
*/
const parseMaps = (input) => {
  return Array.from(input.matchAll(/:([\d\s\n]+)/g)).map((m) =>
    m[1]
      .trim()
      .split("\n")
      .map((conversion) => {
        const nums = conversion.split(" ").map((n) => parseInt(n));
        return {
          src: { start: nums[1], end: nums[1] + nums[2] - 1 },
          dst: { start: nums[0], end: nums[0] + nums[2] - 1 },
        };
      })
  );
};

/*
i =>  seeds: [start, range, start, range] 
o =>  ranges: [{start, end}, {start, end}]
*/
const getStartRanges = (input) => {
  const ranges = [];
  for (let i = 0; i < input.length; i += 2) {
    ranges.push({ start: input[i], end: input[i] + input[i + 1] - 1 });
  }
  return ranges;
};

// Helpers

/* 
i => srcRange: {start, end}, mapRange: {start, end}
o => overlap: {start end}
*/
const getOverlap = (srcRange, mapRange) => {
  if (srcRange.end < mapRange.start || srcRange.start > mapRange.end) {
    return null;
  }
  return {
    start: Math.max(srcRange.start, mapRange.start),
    end: Math.min(srcRange.end, mapRange.end),
  };
};

/*
i =>  range (in source): {start, end} 
      conversion: { src: {start, end}, dst: {start, end} }
o =>  range (in destination): {start, end}
*/
const convertRange = (range, conversion) => {
  const diff = conversion.dst.start - conversion.src.start;
  return { start: range.start + diff, end: range.end + diff };
};

/*
i =>  sourceRanges: [{start, end}, {start, end}]
      coveredRanges: [{start, end}, {start, end}]
o =>  remainingRanges: [{start, end}, {start, end}]

For each range in covered ranges
  Convert remaining ranges to the difference
    Comparing each remaining range to the covered range
    And substituting it with the difference
*/
const subtractRanges = (sourceRanges, coveredRanges) => {
  let remainingRanges = [...sourceRanges];
  for (let coveredRange of coveredRanges) {
    remainingRanges = remainingRanges.reduce((acc, remainingRange) => {
      const overlap = getOverlap(remainingRange, coveredRange);
      if (!overlap) {
        return [...acc, remainingRange];
      }
      if (remainingRange.start < overlap.start) {
        acc.push({ start: remainingRange.start, end: overlap.start - 1 });
      }
      if (remainingRange.end > overlap.end) {
        acc.push({ start: overlap.end + 1, end: remainingRange.end });
      }
      return acc;
    }, []);
  }
  return remainingRanges;
};

// Part 1

/*
i =>  source, map: [{ src: {start, end}, dst: {start, end} }]
o =>  destination

For each conversion in map
  If point is in source range
  Return corresponding destination point
If point is in none of the conversion's source ranges
  Return point
*/
const getSourceToDestForPoint = (point, map) => {
  for (let conversion of map) {
    const diff = point - conversion.src.start;
    const range = conversion.src.end - conversion.src.start;
    if (diff <= range && diff >= 0) {
      return conversion.dst.start + diff;
    }
  }
  return point;
};

/*
i =>  points: [ 79, 14, 55, 13 ], maps
o =>  lowest location

Reduce maps to final destination array
  Acc starts with points as first source array
  For each map
    Convert source array to destination array
    Return as source array for next map
Return min of final destination array 
*/
const getLowestLocationFromPoints = (points, maps) => {
  return Math.min(
    ...maps.reduce((sources, map) => {
      return sources.map((source) => getSourceToDestForPoint(source, map));
    }, points)
  );
};

// Part 2

/*
i =>  sourceRanges: [ {start, end}, {start, end} ]
      map: [ { src: {start, end}, dst: {start, end} },
             { src: {start, end}, dst: {start, end} } ] 
o =>  destinationRanges: [ {start, end}, {start, end} ]

For all conversions in map
    For all source ranges 
      Accumulate the destination ranges
      Accumulate the covered ranges
Add uncovered source ranges without conversion
*/
const getSourceToDestForRanges = (sourceRanges, map) => {
  const destinationRanges = [];
  const coveredRanges = [];
  for (let sourceRange of sourceRanges) {
    for (let conversion of map) {
      const overlap = getOverlap(sourceRange, conversion.src);
      if (overlap) {
        destinationRanges.push(convertRange(overlap, conversion));
        coveredRanges.push(overlap);
      }
    }
  }
  return [...destinationRanges, ...subtractRanges(sourceRanges, coveredRanges)];
};

/*
i =>  ranges: [ {start, end}, {start, end} ], maps
o =>  lowest destination point

For each map
  Convert source ranges to destination ranges
  Where the source ranges are the previous map's destination ranges
Return start of lowest destination range in final destination ranges
*/

const getLowestLocationFromRanges = (ranges, maps) => {
  const destinations = maps
    .reduce((sources, map) => {
      return getSourceToDestForRanges(sources, map);
    }, ranges)
    .sort((a, b) => a.start - b.start);
  return destinations[0].start;
};

// Tests

describe("solution", () => {
  it("should return the correct answer for part 1 mock", () => {
    expect(getLowestLocationFromPoints([79, 14, 55, 13], parseMaps(mock))).toBe(
      35
    );
  });

  it("should return the correct answer for part 2 mock", () => {
    expect(
      getLowestLocationFromRanges(
        getStartRanges([79, 14, 55, 13]),
        parseMaps(mock)
      )
    ).toBe(46);
  });
});

// Answers

const seeds = [
  4121823, 421491713, 1255413673, 350530906, 944138913, 251104806, 481818804,
  233571979, 2906248740, 266447632, 3454130719, 50644329, 1920342932, 127779721,
  2109326496, 538709762, 3579244700, 267233350, 4173137165, 60179884,
];

const maps = parseMaps(input);

console.log("Part 1:", getLowestLocationFromPoints(seeds, maps));

console.log(
  "Part 2:",
  getLowestLocationFromRanges(getStartRanges(seeds), maps)
);
