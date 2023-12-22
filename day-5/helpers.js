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
  i =>  sourceRange: { start, end }
        coveredRanges: { start, end }
  o =>  remainingRange: { start, end}, {start, end}
*/
const subtractRanges = (sourceRange, coveredRange) => {
  if (!coveredRange) return [sourceRange];
  const difference = [];
  if (sourceRange.start < coveredRange.start) {
    difference.push({ start: sourceRange.start, end: coveredRange.start - 1 });
  }
  if (sourceRange.end > coveredRange.end) {
    difference.push({ start: coveredRange.end + 1, end: sourceRange.end });
  }
  return difference;
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

module.exports = {
  parseMaps,
  getStartRanges,
  getOverlap,
  convertRange,
  subtractRanges,
};
