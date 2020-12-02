const { getInput } = require('./utils');

const day1A = async () => {
  let answer;
  let input = await getInput('1');
  input = input.map(Number);

  for (i = 0; i < input.length; i++) {
    for (j = i + 1; j < input.length; j++) {
      if (input[i] + input[j] === 2020) {
        answer = input[i] * input[j];
        break;
      }
    }
    if (answer) {
      break;
    }
  }

  return answer;
};

module.exports = day1A;
