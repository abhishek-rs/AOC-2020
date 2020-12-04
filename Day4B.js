const { getInput } = require('./utils');

const day4B = async () => {
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
  if (
    required.map((r) => Object.keys(passport).includes(r)).filter(Boolean)
      .length === required.length
  ) {
    const noOfValidFields = Object.keys(passport).reduce((acc, f) => {
      let isValid = false;
      switch (f) {
        case 'byr':
          // byr (Birth Year) - four digits; at least 1920 and at most 2002.
          isValid =
            passport[f].length === 4 &&
            Number(passport[f]) >= 1920 &&
            Number(passport[f]) <= 2002;
          break;
        case 'iyr':
          // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
          isValid =
            passport[f].length === 4 &&
            Number(passport[f]) >= 2010 &&
            Number(passport[f]) <= 2020;
          break;
        case 'eyr':
          // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
          isValid =
            passport[f].length === 4 &&
            Number(passport[f]) >= 2020 &&
            Number(passport[f]) <= 2030;
          break;
        case 'hgt':
          // hgt (Height) - a number followed by either cm or in:
          // If cm, the number must be at least 150 and at most 193.
          // If in, the number must be at least 59 and at most 76.
          const [val, unit] = [passport[f].slice(0, -2), passport[f].slice(-2)];
          if (unit === 'cm') {
            isValid = Number(val) >= 150 && Number(val) <= 193;
          } else if (unit === 'in') {
            isValid = Number(val) >= 59 && Number(val) <= 76;
          }
          break;
        case 'hcl':
          // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
          const [first, color] = [passport[f][0], passport[f].slice(1)];
          isValid =
            first === '#' &&
            Array.from(color).filter((c) => /[0-9a-f]/i.test(c)).length === 6;
          break;
        case 'ecl':
          // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
          isValid = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(
            passport[f]
          );
          break;
        case 'pid':
          // pid (Passport ID) - a nine-digit number, including leading zeroes.
          isValid =
            Array.from(passport[f]).filter((p) => /[0-9]/i.test(p)).length ===
            9;
          break;
        default:
          break;
      }
      return isValid ? ++acc : acc;
    }, 0);
    return noOfValidFields === required.length;
  }
  return false;
};

module.exports = day4B;
