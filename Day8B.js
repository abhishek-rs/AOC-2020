const { uniq, sum, all } = require('ramda');
const { getInput } = require('./utils');

const day8B = async () => {
  let input = await getInput('8');
  input = input.map((i) => {
    let [command, value] = i.split(' ');
    return [command, +value];
  });
  const { _, ops: nopsAndJmps } = executeCommands(input);
  let answer;
  for (i = 0; i < nopsAndJmps.length; i++) {
    const currentCommand = nopsAndJmps[i];
    const newOperator = currentCommand[1] === 'nop' ? 'jmp' : 'nop';
    const newCommand = [currentCommand[0], newOperator, currentCommand[2]];
    const { acc: ans, _ } = executeCommands(input, newCommand);
    if (ans) {
      answer = ans;
      break;
    }
  }
  return answer;
};

const executeCommands = (input, altCommand = null) => {
  let acc = 0;
  let executedCommandIds = [];
  let allNopsAndJmps = [];
  let i = 0;

  while (i < input.length) {
    let [command, value] = input[i];
    if (altCommand && altCommand[0] === i) {
      command = altCommand[1];
      value = altCommand[2];
    }
    if (executedCommandIds.includes(i)) {
      return { ans: false, ops: allNopsAndJmps };
    } else {
      executedCommandIds.push(i);
    }

    switch (command) {
      case 'nop':
        allNopsAndJmps.push([i, 'nop', value]);
        i++;
        break;
      case 'acc':
        acc = acc + value;
        i++;
        break;
      case 'jmp':
        allNopsAndJmps.push([i, 'jmp', value]);
        i = i + value;
        break;
      default:
        i++;
        break;
    }
  }
  return { acc: acc, ops: allNopsAndJmps };
};

module.exports = day8B;
