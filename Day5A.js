const { getInputObservable } = require('./utils');
const { take, bufferCount, tap, filter, map, max } = require('rxjs/operators');

const day5A = async () => {
  const inputObservable = await getInputObservable('5');
  const maxSeatIdSub = inputObservable.pipe(
    filter((x) => x !== '\n'),
    bufferCount(10),
    map((ticket) => ({
      rowData: ticket.slice(0, 7),
      colData: ticket.slice(7),
    })),
    map(({ rowData, colData }) => ({
      row: getRow(rowData)[0],
      col: getCol(colData)[0],
    })),
    map(({ row, col }) => row * 8 + col),
    max()
  );
  let maxSeatId;
  const subscription = maxSeatIdSub.subscribe({
    next: (x) => {
      maxSeatId = x;
    },
  });
  subscription.unsubscribe();
  return maxSeatId;
};

const getLocation = (rangeLimits, upperHalfId) => (spatialData) =>
  spatialData.reduce(
    (currentRange, nextHalf, index) =>
      nextHalf === upperHalfId
        ? [Math.ceil((currentRange[0] + currentRange[1]) / 2), currentRange[1]]
        : [
            currentRange[0],
            Math.floor((currentRange[0] + currentRange[1]) / 2),
          ],
    rangeLimits
  );

const getRow = getLocation([0, 127], 'B');

const getCol = getLocation([0, 7], 'R');

module.exports = day5A;
