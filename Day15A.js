const { findLastIndex, slice } = require('ramda');
const { getInput } = require('./utils');

const day15A = async () => {
  let input = await getInput('15', ',');
  input = input.map(Number);
  const gameResponses = Array.from(input);
  const startIndex = gameResponses.length - 1;
  for (i = startIndex; i < 2020; i++) {
    const lastAppeared = findLastIndex(
      (x) => x === gameResponses[i],
      slice(0, i, gameResponses)
    );
    const nextNumber = lastAppeared === -1 ? 0 : i - lastAppeared;
    gameResponses.push(nextNumber);
  }
  return gameResponses[2019];
};

module.exports = day15A;
