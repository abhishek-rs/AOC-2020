const { getInput } = require('./utils');
const { intersection } = require('ramda');

const day22A = async () => {
  const input = await getInput('22', '\n\n');
  let [player1, player2] = [
    input[0].split('\n').slice(1).map(Number),
    input[1].split('\n').slice(1).map(Number),
  ];
  let noOfRounds = 0;
  while (player1.length && player2.length) {
    noOfRounds++;
    let player1Card = player1.shift();
    let player2Card = player2.shift();
    if (player1Card > player2Card) {
      player1 = player1.concat(player1Card, player2Card);
    } else {
      player2 = player2.concat(player2Card, player1Card);
    }
  }

  const winner = player1.length ? player1 : player2;
  return winner.reduce(
    (acc, card, index) => acc + card * (winner.length - index),
    0
  );
};

module.exports = day22A;
