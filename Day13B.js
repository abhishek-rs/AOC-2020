const { getInput } = require('./utils');

const day13B = async () => {
  const input = await getInput('13', '\n');
  const busIdsAndDiffs = input[1]
    .split(',')
    .map((x, i) => (x !== 'x' ? [Number(x), i] : null))
    .filter(Boolean);

  console.time('Start loop');
  /*********
  Bruteforce (works for examples)

  while (!found) {
    answer += busIdsAndDiffs[0][0];
    found = true;
    for (i = 0; i < busIdsAndDiffs.length; i++) {
      let [id, diff] = busIdsAndDiffs[i];
      if ((answer + diff) % id !== 0) {
        found = false;
        break;
      }
    }
  }
  ********/
  let startVal = 0;
  let jump = 1;
  let currentAnswer;
  for (let i = 0; i < busIdsAndDiffs.length; i++) {
    currentAnswer = getLocalFactor(
      startVal,
      jump,
      busIdsAndDiffs.slice(0, i + 1)
    );
    jump = jump * busIdsAndDiffs[i][0];
    startVal = currentAnswer;
  }
  console.timeEnd('Start loop');

  return currentAnswer;
};

const getLocalFactor = (startValue, jump, subset) => {
  let found = false;
  let answer = startValue;
  while (!found) {
    answer += jump;
    found = true;
    for (i = 0; i < subset.length; i++) {
      let [id, diff] = subset[i];
      if ((answer + diff) % id !== 0) {
        found = false;
        break;
      }
    }
  }
  return answer;
};

module.exports = day13B;
