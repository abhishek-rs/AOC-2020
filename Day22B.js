const { getInput } = require('./utils');
const { equals } = require('ramda');

const day22B = async () => {
  const input = await getInput('22', '\n\n');
  let [player1, player2] = [
    input[0].split('\n').slice(1).map(Number),
    input[1].split('\n').slice(1).map(Number),
  ];
  const [_, winner] = playRecursiveCombat(player1, player2);
  return winner.reduce(
    (acc, card, index) => acc + card * (winner.length - index),
    0
  );
};

const playRecursiveCombat = (player1Deck, player2Deck) => {
  let prevDecks = [
    [
      /* player1 */
    ],
    [
      /* player2 */
    ],
  ];
  while (player1Deck.length && player2Deck.length) {
    if (
      prevDecks[0].findIndex((deck) => equals(deck, player1Deck)) !== -1 ||
      prevDecks[1].findIndex((deck) => equals(deck, player2Deck)) !== -1
    ) {
      player2Deck = [];
      break;
    }
    prevDecks[0].push(Array.from(player1Deck));
    prevDecks[1].push(Array.from(player2Deck));
    let player1Card = player1Deck.shift();
    let player2Card = player2Deck.shift();
    if (
      player1Deck.length >= player1Card &&
      player2Deck.length >= player2Card
    ) {
      const newPlayer1Deck = Array.from(player1Deck);
      const newPlayer2Deck = Array.from(player2Deck);
      const [winnerId, _] = playRecursiveCombat(
        newPlayer1Deck.splice(0, player1Card),
        newPlayer2Deck.splice(0, player2Card)
      );
      if (winnerId) {
        player2Deck = player2Deck.concat(player2Card, player1Card);
      } else {
        player1Deck = player1Deck.concat(player1Card, player2Card);
      }
    } else if (player1Card > player2Card) {
      player1Deck = player1Deck.concat(player1Card, player2Card);
    } else {
      player2Deck = player2Deck.concat(player2Card, player1Card);
    }
  }

  return player1Deck.length ? [0, player1Deck] : [1, player2Deck];
};

module.exports = day22B;
