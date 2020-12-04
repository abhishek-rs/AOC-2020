const { getInput } = require('./utils');

const day4A = async () => {
  let input = await getInput('4', /^\s*\n/gm);
  input = input.map((i) =>
    i
      .split('\n')
      .join(' ')
      .trim()
      .split(' ')
      .reduce((acc, j) => {
        const [key, val] = j.split(':');
        return Object.assign(acc, { [key]: val });
      }, {})
  );
  const noOfValidPassports = input.filter(
    testValidity(['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'], ['cid'])
  );
  return noOfValidPassports.length;
};

const testValidity = (required, optional) => (passport) => {
  return (
    required.map((r) => Object.keys(passport).includes(r)).filter(Boolean)
      .length === required.length
  );
};

module.exports = day4A;
