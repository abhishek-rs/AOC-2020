const { uniq, sum, all } = require('ramda');
const { getInput } = require('./utils');

const bagRegex = / (bags|bag)/i;

const day7B = async () => {
  const input = await getInput('7');
  const bagDirectory = [];
  input.forEach(parseBagData(bagDirectory));
  return findNoOfPossibleChildrenOf('shiny gold', bagDirectory);
};

const parseBagData = (bagDirectory) => (bagData) => {
  let [parentBag, childBagData] = bagData.split('contain');
  childBagData = childBagData.slice(0, -1).split(',');
  parentBag = parentBag.split(bagRegex)[0];
  const childrenBags = childBagData
    .map((childBag) => {
      let bagData = childBag.trim().split(bagRegex)[0];
      if (bagData === 'no other') {
        return null;
      }
      bagData = {
        [bagData.split(/\d/i)[1].trim()]: Number(bagData.match(/\d/i)[0]),
      };
      return bagData;
    })
    .filter(Boolean);
  bagDirectory[parentBag] = childrenBags;
};

const findNoOfPossibleChildrenOf = (bag, bagDirectory) => {
  if (!bagDirectory[bag].length) {
    return 0;
  } else {
    return bagDirectory[bag].reduce((acc, currentBag) => {
      let currentBagName = Object.keys(currentBag)[0];
      return (
        acc +
        currentBag[currentBagName] +
        currentBag[currentBagName] *
          findNoOfPossibleChildrenOf(currentBagName, bagDirectory)
      );
    }, 0);
  }
};

module.exports = day7B;
