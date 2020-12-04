const { readFileSync } = require('fs');

const getInput = async (dayNo, separator = '\n') => {
  const input = await readFileSync(`./inputs/${dayNo}`, 'utf-8');
  return input.split(separator);
};

module.exports = { getInput };
