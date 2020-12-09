const { scan, map, tap, filter, first } = require('rxjs/operators');
const { getInputObservable } = require('./utils');

const day9A = async () => {
  const input = await getInputObservable('9', '\n');
  const weakness = input.pipe(
    map((i) => +i),
    scan(
      (lastXItems, curr) => {
        if (lastXItems[0].length === 25) {
          if (lastXItems[1] !== null) {
            lastXItems[0].push(lastXItems[1]);
            lastXItems[0].shift();
          }
          return [lastXItems[0], curr];
        } else {
          lastXItems[0].push(curr);
          return [lastXItems[0], null, []];
        }
      },
      [[], null]
    ),
    filter((x) => x[1]),
    map((x) => {
      let [preamble, curr] = x;
      return [curr, hasConstituents(preamble, curr)];
    }),
    filter((x) => !x[1]),
    first()
  );
  let answer;
  const sub = weakness.subscribe((x) => {
    answer = x[0];
  });
  sub.unsubscribe();
  return answer;
};

const hasConstituents = (arr, val) => {
  for (i = 0; i < arr.length; i++) {
    for (j = 0; j != i && j < arr.length; j++) {
      if (arr[i] + arr[j] === val) {
        return true;
      }
    }
  }
  return false;
};

module.exports = day9A;
