const { getInput } = require('./utils');
const toBinary = (int) => Number(int).toString(2);
const toInt = (bin) => parseInt(bin, 2);

const day14A = async () => {
  const input = await getInput('14', '\n');
  let memory = {};
  let currentMask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  input.forEach((command) => {
    let [cmd, val] = command.split(' = ');
    if (/mask/i.test(cmd)) {
      currentMask = val;
    } else {
      let pos = cmd.match(/[0-9]+/i)[0];
      val = Number(val);
      let binaryVal = toBinary(val);
      binaryVal = applyMask(binaryVal, currentMask);
      val = toInt(binaryVal);
      memory[pos] = val;
    }
  });

  return Object.values(memory).reduce((acc, x) => acc + x, 0);
};

const applyMask = (bin, mask) => {
  let diff = mask.length - bin.length;
  while (diff > 0) {
    bin = '0' + bin;
    diff--;
  }
  const binArray = bin.split('');
  const maskArray = mask.split('');

  return binArray
    .map((bit, i) => (mask[i] === '1' ? '1' : mask[i] === '0' ? '0' : bit))
    .join('');
};

module.exports = day14A;
