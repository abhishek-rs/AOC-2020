const { getInput } = require('./utils');
const { equals } = require('ramda');

/***********
     COMPASS
    NW /|\ NE
    W |-*-| E
    SW \|/ SE
 ************/

const day24A = async () => {
  let input = await getInput('24');
  input = input.map((i) => i.split(''));
  // Position on axes: [e/w, n/s]
  const startingPos = [0, 0];
  let blackTiles = [];

  input.forEach((tile) => {
    let currPos = Array.from(startingPos);
    while (tile.length) {
      let nextDir = tile.shift();
      if (nextDir === 'n' || nextDir === 's') {
        let nextDir2 = tile.shift();
        nextDir = nextDir + nextDir2;
      }
      currPos = moveTo(nextDir, currPos);
    }
    const id = blackTiles.findIndex((tile) => equals(tile, currPos));
    if (id === -1) {
      blackTiles.push(currPos);
    } else {
      blackTiles.splice(id, 1);
    }
  });
  return blackTiles.length;
};

const moveTo = (dir, starting) => {
  switch (dir) {
    case 'e':
      return [starting[0] + 2, starting[1]];
    case 'w':
      return [starting[0] - 2, starting[1]];
    case 'nw':
      return [starting[0] - 1, starting[1] + 1];
    case 'sw':
      return [starting[0] - 1, starting[1] - 1];
    case 'ne':
      return [starting[0] + 1, starting[1] + 1];
    case 'se':
      return [starting[0] + 1, starting[1] - 1];
    default:
      return null;
  }
};

module.exports = day24A;
