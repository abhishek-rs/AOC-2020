const { getInput } = require('./utils');

const day23A = async () => {
  let input = await getInput('23');
  input = input[0].split('').map(Number);

  let noOfRounds = 0;
  let currentCupId = 0;

  while (noOfRounds < 100) {
    let currentCup = input[currentCupId];
    let pickedUpCups;
    [pickedUpCups, input] = smartSplice(input, currentCupId + 1, 3);
    let destinationCup = currentCup - 1 < 1 ? 9 : currentCup - 1;
    while (pickedUpCups.includes(destinationCup)) {
      --destinationCup;
      if (destinationCup < 1) {
        destinationCup = 9;
      }
    }
    let destinationCupId = input.findIndex((c) => c === destinationCup);
    input.splice(destinationCupId + 1, 0, ...pickedUpCups);
    currentCupId = input.findIndex((c) => c === currentCup);
    currentCupId = (currentCupId + 1) % input.length;
    noOfRounds++;
  }

  const indexOf1 = input.findIndex((i) => i === 1);

  return input
    .reduce((acc, i, index) => {
      if (index === indexOf1) return acc;
      else if (index < indexOf1) acc[input.length - 1 - indexOf1 - index] = i;
      else acc[index - indexOf1 - 1] = i;
      return acc;
    }, new Array(input.length - 1))
    .join('');
};

const smartSplice = (arr, startIndex, deleteCount, ...items) => {
  let inputArray = Array.from(arr);
  let retArray = [];
  if (!deleteCount || startIndex + deleteCount <= inputArray.length) {
    retArray = inputArray.splice(startIndex, deleteCount, ...items);
    return [retArray, inputArray];
  }

  let toBeRemoved = [];
  while (deleteCount) {
    let indexToRemove = startIndex % inputArray.length;
    retArray.push(inputArray[indexToRemove]);
    inputArray[indexToRemove] = null;
    startIndex++;
    deleteCount--;
  }
  inputArray = inputArray.filter(Boolean);
  return [retArray, inputArray];
};

module.exports = day23A;
