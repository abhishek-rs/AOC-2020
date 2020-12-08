const { uniq, sum, all } = require('ramda');
const { getInput } = require('./utils');

const day8A = async () => {
  let input = await getInput('8');
  input = input.map((i) => {
    let [command, value] = i.split(' ');
    return [command, +value];
  });
  const answer = executeCommands(input);
  return answer;
};

const executeCommands = (input) => {
  let acc = 0;
  let executedCommandIds = [];
  let i = 0;
  while (i < input.length) {
    let [command, value] = input[i];
    if (executedCommandIds.includes(i)) {
      return acc;
    } else {
      executedCommandIds.push(i);
    }

    switch (input[i][0]) {
      case 'nop':
        i++;
        break;
      case 'acc':
        acc = acc + value;
        i++;
        break;
      case 'jmp':
        i = i + value;
        break;
      default:
        i++;
        break;
    }
  }

  return acc;
};

module.exports = day8A;
