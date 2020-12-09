const { readFileSync } = require('fs');
const { from } = require('rxjs');

const getInput = async (dayNo, separator = '\n') => {
  const input = await readFileSync(`./inputs/${dayNo}`, 'utf-8');
  return input.split(separator);
};

const getInputObservable = async (dayNo, separator) => {
  const input = await readFileSync(`./inputs/${dayNo}`, 'utf-8');
  return separator ? from(input.split(separator)) : from(input);
};

module.exports = { getInput, getInputObservable };
