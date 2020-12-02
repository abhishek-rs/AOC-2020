const { getInput } = require('./utils');

const day2B = async () => {
  let input = await getInput('2');
  let inputTuples = input.map((i) => i.split(':'));

  const answer = inputTuples.reduce((acc, tuple) => {
    const [rule, password] = tuple;
    const [positions, letterToLookFor] = rule.split(' ');
    const [pos1, pos2] = positions.split('-');

    const timesLetterToLookForAppears = [password[pos1], password[pos2]].filter(
      (x) => x == letterToLookFor
    ).length;

    return timesLetterToLookForAppears === 1 ? ++acc : acc;
  }, 0);

  return answer;
};

module.exports = day2B;
