/*
  o => maps: [ [ {src: {start, end}, dst: {start, end}} ] ]
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
  o => ranges: [ {start, end}, {start, end}]
*/
const getStartRanges = (input) => {
  const ranges = [];
  for (let i = 0; i < input.length; i += 2) {
    ranges.push({ start: input[i], end: input[i] + input[i + 1] - 1 });
  }
  return ranges;
};

/* 
  i => range1, range2
  o => overlap
*/
const getOverlap = (range1, range2) => {
  if (range1.end < range2.start || range1.start > range2.end) {
    return null;
  }
  return {
    start: Math.max(range1.start, range2.start),
    end: Math.min(range1.end, range2.end),
  };
};

/*
  i =>  range1, range2
  o =>  difference
*/
const subtractRanges = (range1, range2) => {
  if (!range2) return [range1];
  const difference = [];
  if (range1.start < range2.start) {
    difference.push({ start: range1.start, end: range2.start - 1 });
  }
  if (range1.end > range2.end) {
    difference.push({ start: range2.end + 1, end: range1.end });
  }
  return difference;
};

/*
  i =>  range, conversion
  o =>  converted range
*/
const convertRange = (range, conversion) => {
  const diff = conversion.dst.start - conversion.src.start;
  return { start: range.start + diff, end: range.end + diff };
};

module.exports = {
  parseMaps,
  getStartRanges,
  getOverlap,
  convertRange,
  subtractRanges,
};
