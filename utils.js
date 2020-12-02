const { readFileSync } = require('fs');

const getInput = async (dayNo) => {
  const input = await readFileSync(`./inputs/${dayNo}`, 'utf-8');
  return input.split('\n');
};

module.exports = { getInput };
