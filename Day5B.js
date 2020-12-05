const { getInputObservable } = require('./utils');
const {
  take,
  bufferCount,
  tap,
  filter,
  map,
  max,
  toArray,
  mergeMap,
  pairwise,
  last,
} = require('rxjs/operators');
const { from } = require('rxjs');

const day5B = async () => {
  const inputObservable = await getInputObservable('5');
  const emptySeatSub = inputObservable.pipe(
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
    toArray(),
    map((takenSeats) => takenSeats.sort()),
    mergeMap((x) => from(x)),
    pairwise(),
    filter((tuple) => tuple[1] - tuple[0] > 1),
    map((x) => x[1] - 1),
    last()
  );
  let emptySeat;
  const subscription = emptySeatSub.subscribe({
    next: (x) => {
      emptySeat = x;
    },
  });
  subscription.unsubscribe();
  return emptySeat;
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

module.exports = day5B;
