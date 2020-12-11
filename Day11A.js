const { equals } = require('ramda');
const { getInput } = require('./utils');

const day11A = async () => {
  let input = await getInput('11', '\n');
  input = input.map((i) => i.split(''));
  let done = false;
  let currState = input.map((arr) => arr.slice());
  while (!done) {
    let prevState = currState.map((arr) => arr.slice());
    currState = assignSeats(currState);
    done = checkForSameness(prevState, currState);
  }
  return noOfSeatsOccupied(currState);
};

const getAdjacents = (rowNo, colNo, maxRows, maxCols) => {
  let possibleAdjacents = [];
  for (i = rowNo - 1; i <= rowNo + 1; i++) {
    for (j = colNo - 1; j <= colNo + 1; j++) {
      if (
        i > -1 &&
        i < maxRows &&
        j > -1 &&
        j < maxCols &&
        (i !== rowNo || j !== colNo)
      ) {
        possibleAdjacents.push([i, j]);
      }
    }
  }
  return possibleAdjacents;
};

const assignSeats = (inputChart) => {
  let seatingChart = inputChart.map((arr) => arr.slice());
  seatingChart.forEach((row, x) => {
    for (y = 0; y < row.length; y++) {
      if (row[y] === '.') {
        continue;
      }
      const adjacentSeats = getAdjacents(x, y, inputChart.length, row.length);
      const noOfOccupiedAdjacents = adjacentSeats.filter(
        (seat) => inputChart[seat[0]][seat[1]] === '#'
      ).length;
      if (row[y] === 'L' && noOfOccupiedAdjacents === 0) {
        row[y] = '#';
      } else if (row[y] === '#' && noOfOccupiedAdjacents >= 4) {
        row[y] = 'L';
      } else {
        continue;
      }
    }
  });
  return seatingChart;
};

const checkForSameness = (oldChart, newChart) => {
  return (
    oldChart
      .reduce((acc, row, i) => [...acc, equals(row, newChart[i])], [])
      .filter(Boolean).length === oldChart.length
  );
};

const noOfSeatsOccupied = (seatingChart) => {
  return seatingChart.reduce(
    (acc, currRow) => currRow.filter((x) => x === '#').length + acc,
    0
  );
};

module.exports = day11A;
