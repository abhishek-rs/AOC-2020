const { getInput } = require('./utils');

const day13A = async () => {
  const input = await getInput('13', '\n');
  const startTime = Number(input[0]);
  const busIds = input[1]
    .split(',')
    .filter((x) => x !== 'x')
    .map(Number);
  const startDiffs = busIds.reduce((acc, busId) => {
    let remainder = startTime % busId;
    let closestRideNumber = Math.floor(startTime / busId);
    return [
      ...acc,
      !remainder
        ? busId * closestRideNumber - startTime
        : busId * (closestRideNumber + 1) - startTime,
    ];
  }, []);
  const closestBusAndDiff = startDiffs.reduce(
    (min, diff, index) => {
      return diff < min[0] ? [diff, busIds[index]] : min;
    },
    [Infinity, null]
  );
  return closestBusAndDiff[0] * closestBusAndDiff[1];
};

module.exports = day13A;
