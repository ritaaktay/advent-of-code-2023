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
I can't consider each seed individually - the range of the seeds is too large.
But since the relationships are all described between ranges, 
I can compare the ranges to each other, and deal only with the delimiting numbers.

We need to:
- Convert the source ranges to destination ranges,
   Iteratively for all maps where,
   One map's destination ranges are the next map's source ranges

The tricky part is, a source range can correspond to multiple conversions of a map...
So ranges will keep breaking up into smaller parts. 

We'll need to find intersections, subtractions and conversions of ranges.

map: [
  { src: {start, end}, dst: {start, end} }, // conversion
  { src: {start, end}, dst: {start, end} }
]

range: { start, end }
*/

// Part 1

/*
i =>  source point, map
o =>  destination point

For each conversion in map
  Return destination point if source point is in range
  Else return point
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
i =>  points, maps
o =>  lowest location

Reduce maps to final destinations
  Acc starts with source points array
  For each map
    Convert source points to destination points
    Pass onto next map
Return min
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
i =>  source ranges, map
o =>  destination ranges

For all conversions in a map
    For all remaining source ranges
      Accumulate the destination ranges 
      And subtract them from the remaining ranges 
      Pass onto next conversion
Return the destination ranges plus remaining ranges
*/

const getSourceToDestForRanges = (sourceRanges, map) => {
  const destinationRanges = [];
  let remainingRanges = [...sourceRanges];
  for (let conversion of map) {
    const remainingAfterConversion = [];
    for (let remainingRange of remainingRanges) {
      const overlap = getOverlap(remainingRange, conversion.src);
      if (overlap) destinationRanges.push(convertRange(overlap, conversion));
      remainingAfterConversion.push(...subtractRanges(remainingRange, overlap));
    }
    remainingRanges = remainingAfterConversion;
  }
  return [...destinationRanges, ...remainingRanges];
};

/*
i =>  ranges, maps
o =>  lowest destination point

For each map
  Convert source ranges to destination ranges
  And pass onto next map
Return start of lowest range
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

const before = Date.now();

console.log(
  "Part 2:",
  getLowestLocationFromRanges(getStartRanges(seeds), maps)
); //72263011

console.log("That took:", Date.now() - before, "ms");
