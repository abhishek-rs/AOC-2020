const { getInput } = require('./utils');

const day3B = async () => {
  let input = await getInput('3');
  let answer = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ].reduce((acc, slopes) => {
    const noOfTrees = traverse(input, slopes);
    return acc * noOfTrees;
  }, 1);
  return answer;
};

const traverse = (map, slopes) => {
  const [slopeX, slopeY] = slopes;
  let noOfTrees = 0;
  for (
    i = 0, j = 0;
    i < map.length;
    i = i + slopeY, j = (j + slopeX) % map[0].length
  ) {
    if (map[i][j] === '#') {
      noOfTrees++;
    }
  }
  return noOfTrees;
};

module.exports = day3B;
