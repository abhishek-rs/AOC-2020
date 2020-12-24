const { getInput } = require('./utils');

const day23B = async () => {
  let input = await getInput('23');
  input = input[0].split('').map(Number);

  const cupList = new Map();
  input.forEach((val, index, arr) => {
    cupList.set(val, index < arr.length - 1 ? arr[index + 1] : 10);
  });

  // Ensure circle
  cupList.set(1000000, input[0]);

  let noOfRounds = 0;
  let currentCup = input[0];

  while (noOfRounds < 10000000) {
    const pickedUpCups = pickUpNextThree(currentCup, cupList);
    let destinationCup = currentCup - 1 < 1 ? 1000000 : currentCup - 1;
    while (pickedUpCups.includes(destinationCup)) {
      --destinationCup;
      if (destinationCup < 1) {
        destinationCup = 1000000;
      }
    }
    // Insert picked after destination
    const afterDest = getFromMap(destinationCup, cupList);
    cupList.set(destinationCup, pickedUpCups[0]);
    cupList.set(pickedUpCups[2], afterDest);
    currentCup = getFromMap(currentCup, cupList);
    noOfRounds++;
  }

  const nextToOne = cupList.get(1);
  return nextToOne * cupList.get(nextToOne);
};

const getFromMap = (index, map) => {
  const val = map.get(index);
  if (val) return val;
  map.set(index, index + 1);
  return index + 1;
};

const pickUpNextThree = (curr, map) => {
  const next = getFromMap(curr, map);
  const nextPlusOne = getFromMap(next, map);
  const nextPlusTwo = getFromMap(nextPlusOne, map);
  // Set current's next to the last picked item's next
  map.set(curr, getFromMap(nextPlusTwo, map));
  return [next, nextPlusOne, nextPlusTwo];
};

module.exports = day23B;
