const { getInput } = require('./utils');

const day15B = async () => {
  let input = await getInput('15', ',');
  const inputMap = input.reduce(
    (acc, num, i) => acc.set(Number(num), i + 1),
    new Map()
  );
  let next = 0;
  let last;
  for (i = input.length + 1; i < 30000000; i++) {
    last = inputMap.get(next) || 0;
    inputMap.set(next, i);
    next = last && i - last;
  }
  return next;
};

module.exports = day15B;
