const { getInput } = require('./utils');
const toBinary = (int) => Number(int).toString(2);
const toInt = (bin) => parseInt(bin, 2);

const day14B = async () => {
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
      pos = Number(pos);
      let binaryPos = toBinary(pos);
      binaryPos = applyMask(binaryPos, currentMask);
      let allPos = getAllPossiblePositions(binaryPos);
      allPos.forEach((pos) => {
        let intPos = toInt(pos.join(''));
        memory[intPos] = val;
      });
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
    .map((bit, i) => (mask[i] === '1' ? '1' : mask[i] === 'X' ? 'X' : bit))
    .join('');
};

const getAllPossiblePositions = (floatingPos) => {
  let maskArray = floatingPos.split('');
  return getAllPerms([maskArray]);
};

const getAllPerms = (arr) => {
  const indexOfFloatingBit = arr[0].findIndex((x) => x === 'X');
  if (indexOfFloatingBit === -1) {
    return arr;
  }
  let arrWithOne = Array.from(arr[0]);
  arrWithOne.splice(indexOfFloatingBit, 1, '1');
  let arrWithZero = Array.from(arr[0]);
  arrWithZero.splice(indexOfFloatingBit, 1, '0');
  return [...getAllPerms([arrWithOne]), ...getAllPerms([arrWithZero])];
};

module.exports = day14B;
