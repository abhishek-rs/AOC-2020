const { getInput } = require('./utils');

const day25A = async () => {
  const [cardPublicKey, doorPublicKey] = await (await getInput('25')).map(
    Number
  );
  const cardLoopSize = getLoopSize(cardPublicKey, 7);
  const doorLoopSize = getLoopSize(doorPublicKey, 7);

  return transform(cardPublicKey, cardPublicKey, doorLoopSize);
};

const getLoopSize = (publicKey, subjectNumber) => {
  let startAt = subjectNumber;
  let loopSize = 1;
  while (startAt != publicKey) {
    startAt = transform(startAt, subjectNumber);
    loopSize++;
  }
  return loopSize;
};

const transform = (start, subject, times = null) => {
  if (!times) {
    return (start * subject) % 20201227;
  }
  let val = start;
  let i = 1;
  while (i < times) {
    val = (val * subject) % 20201227;
    i++;
  }
  return val;
};

module.exports = day25A;
