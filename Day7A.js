const { uniq, sum, all } = require('ramda');
const { getInput } = require('./utils');

const bagRegex = / (bags|bag)/i;

const day7A = async () => {
  const input = await getInput('7');
  const bagDirectory = [];
  input.forEach(parseBagData(bagDirectory));
  const allParents = findNoOfPossibleParentsOf('shiny gold', bagDirectory);
  return uniq(allParents).length;
};

const parseBagData = (bagDirectory) => (bagData) => {
  let [parentBag, childBagData] = bagData.split('contain');
  childBagData = childBagData.slice(0, -1).split(',');
  parentBag = parentBag.split(bagRegex)[0];
  const childrenBags = childBagData.map((childBag) => {
    let bagData = childBag.trim().split(bagRegex)[0];
    if (bagData === 'no other') return [];
    bagData = {
      [bagData.split(/\d/i)[1].trim()]: Number(bagData.match(/\d/i)[0]),
    };
    return bagData;
  });

  childrenBags.forEach((childBag) => {
    const bagName = Object.keys(childBag)[0];
    if (childBag[bagName] === undefined) {
      if (bagDirectory['NO_CHILD']) {
        bagDirectory['NO_CHILD'].push(parentBag);
      } else {
        bagDirectory['NO_CHILD'] = [parentBag];
      }
    } else if (bagDirectory[bagName]) {
      bagDirectory[bagName].push({ [parentBag]: childBag[bagName] });
    } else {
      bagDirectory[bagName] = [{ [parentBag]: childBag[bagName] }];
    }
  });
};

const findNoOfPossibleParentsOf = (bag, bagDirectory) => {
  if (bagDirectory[bag] === undefined) {
    return [];
  } else {
    return bagDirectory[bag].reduce(
      (acc, currentBag) => {
        let currentBagName = Object.keys(currentBag)[0];
        return acc.concat(
          findNoOfPossibleParentsOf(currentBagName, bagDirectory)
        );
      },
      bagDirectory[bag].map((x) => Object.keys(x)[0])
    );
  }
};

module.exports = day7A;
