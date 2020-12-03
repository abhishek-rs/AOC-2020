const { getInput } = require('./utils');

const day3A = async () => {
  let input = await getInput('3');
  let xcoord = 0;
  let answer = input.reduce((acc, row, index) => {
    row[xcoord] === '#' && acc++;
    xcoord = (xcoord + 3) % row.length;
    return acc;
  }, 0);
  return answer;
};

module.exports = day3A;
