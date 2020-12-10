const { getInput } = require('./utils');

const day10B = async () => {
  let input = await getInput('10', '\n');
  input = input.map((i) => +i);
  input.sort((a, b) => a - b);
  input.unshift(0);
  const deviceJoltage = input[input.length - 1] + 3;
  input.push(deviceJoltage);

  const diffs = input
    .map((i, index, arr) =>
      index >= arr.length - 2 ? null : arr[index + 1] - i
    )
    .filter(Boolean);

  const noOfVariations = diffs.reduce(
    (acc, curr, index) => {
      // Using groups of tribonacci sequences
      const tribonnaciMultipliers = [1, 2, 4, 7, 13];
      if (curr === 3) {
        if (acc[0].length) {
          acc[1] = acc[1] * tribonnaciMultipliers[acc[0].length - 1];
          return [[], acc[1]];
        }
        return acc;
      } else if (index === diffs.length - 1) {
        acc[0].push(curr);
        acc[1] = acc[1] * tribonnaciMultipliers[acc[0].length - 1];
        return acc;
      } else {
        acc[0].push(curr);
        return acc;
      }
    },
    [[], 1]
  );
  return noOfVariations[1];
};

module.exports = day10B;
