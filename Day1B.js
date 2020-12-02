const { getInput } = require('./utils');

const day1B = async () => {
  let answer;
  let input = await getInput('1');
  input = input.map(Number);

  for (i = 0; i < input.length; i++) {
    for (j = i + 1; j < input.length; j++) {
      for (k = j + 1; k < input.length; k++) {
        if (input[i] + input[j] + input[k] === 2020) {
          answer = input[i] * input[j] * input[k];
          break;
        }
      }
      if (answer) {
        break;
      }
    }
    if (answer) {
      break;
    }
  }

  return answer;
};

module.exports = day1B;
