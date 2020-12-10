const { getInput } = require('./utils');

const day10A = async () => {
  let input = await getInput('10', '\n');
  input = input.map((i) => +i);
  input.sort((a, b) => a - b);
  const deviceJoltage = input[input.length - 1] + 3;

  const [ones, threes] = input.reduce(
    (acc, curr, index, arr) => {
      if (index === arr.length - 1) {
        return [acc[0], acc[1] + 1];
      } else {
        if (arr[index + 1] - curr === 3) {
          return [acc[0], acc[1] + 1];
        } else {
          return [acc[0] + 1, acc[1]];
        }
      }
    },
    [1, 0]
  );
  return ones * threes;
};

module.exports = day10A;
