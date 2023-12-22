const { readFileSync } = require("fs");
const {
  parseMaps,
  getStartRanges,
  getOverlap,
  subtractRanges,
  convertRange,
} = require("./helpers");
const mock = readFileSync("./day-5/mock-1.txt").toString();
const input = readFileSync("./day-5/input-1.txt").toString();

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
    For all remaining source ranges
      Accumulate the converted ranges 
      Subtract the converted ranges from the remaining ranges before next conversion
Return the converted ranges and the remaining ranges
*/

const getSourceToDestForRanges = (sourceRanges, map) => {
  const convertedRanges = [];
  let remainingRanges = [...sourceRanges];
  for (let conversion of map) {
    const remainingAfterConversion = [];
    for (let remainingRange of remainingRanges) {
      const overlap = getOverlap(remainingRange, conversion.src);
      if (overlap) convertedRanges.push(convertRange(overlap, conversion));
      remainingAfterConversion.push(...subtractRanges(remainingRange, overlap));
    }
    remainingRanges = remainingAfterConversion;
  }
  return [...convertedRanges, ...remainingRanges];
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

console.log("Part 1:", getLowestLocationFromPoints(seeds, maps)); // 251346198

console.log(
  "Part 2:",
  getLowestLocationFromRanges(getStartRanges(seeds), maps)
); //72263011
