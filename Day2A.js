const { getInput } = require('./utils');

const day2A = async () => {
  let input = await getInput('2');
  let inputTuples = input.map((i) => i.split(':'));

  const answer = inputTuples.reduce((acc, tuple) => {
    const [rule, password] = tuple;
    const [range, letterToLookFor] = rule.split(' ');
    const [min, max] = range.split('-');

    const timesLetterToLookForAppears = Array.from(password).filter(
      (x) => x == letterToLookFor
    ).length;

    return timesLetterToLookForAppears >= min &&
      timesLetterToLookForAppears <= max
      ? ++acc
      : acc;
  }, 0);

  return answer;
};

module.exports = day2A;
