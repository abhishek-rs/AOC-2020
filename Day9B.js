const { getInput } = require('./utils');
const { sum } = require('ramda');

const day9B = async () => {
  let input = await getInput('9');
  input = input.map((i) => +i);
  let posOfWeakness = 667;
  const contiguousSet = getContiguousSet(input, posOfWeakness);
  contiguousSet.sort((a, b) => a - b);
  return contiguousSet[0] + contiguousSet[contiguousSet.length - 1];
};

const getContiguousSet = (input, posToStart) => {
  const valueToAchieve = input[posToStart];
  let done = false;
  let nextValueId = posToStart - 1;
  let contiguousSet = [input[nextValueId]];
  while (!done) {
    const currentSum = sum(contiguousSet);
    if (currentSum === valueToAchieve || nextValueId === -1) {
      done = true;
    } else if (currentSum > valueToAchieve) {
      contiguousSet.shift();
    } else {
      nextValueId--;
      contiguousSet.push(input[nextValueId]);
    }
  }
  return contiguousSet;
};

module.exports = day9B;
