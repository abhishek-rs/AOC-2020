const { getInput } = require('./utils');
const { equals } = require('ramda');

/***********
     COMPASS
    NW /|\ NE
    W |-*-| E
    SW \|/ SE
 ************/

const day24B = async () => {
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

  const blackTilesMap = new Map();
  // Move to a map so the lookup and updates are faster
  blackTiles.forEach((tile) => blackTilesMap.set(tile.join(','), 1));

  let days = 0;
  while (days < 100) {
    let toRemove = [];
    let toAdd = [];
    let adjacentWhiteTiles = new Map();
    blackTilesMap.forEach((isBlack, tile) => {
      if (!isBlack) return;
      const noOfAdjacentBlackTiles = updateAdjacents(
        tile.split(',').map(Number),
        adjacentWhiteTiles,
        blackTilesMap
      );
      if (noOfAdjacentBlackTiles === 0 || noOfAdjacentBlackTiles > 2) {
        toRemove.push(tile);
      }
    });
    adjacentWhiteTiles.forEach((val, key) => val === 2 && toAdd.push(key));
    toRemove.forEach((tile) => {
      blackTilesMap.set(tile, 0);
    });
    toAdd.forEach((tile) => {
      blackTilesMap.set(tile, 1);
    });
    days++;
  }

  let totalBlackTiles = 0;
  blackTilesMap.forEach((val) => {
    if (val === 1) {
      totalBlackTiles++;
    }
  });
  return totalBlackTiles;
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

const updateAdjacents = (tile, whiteTilesMap, blackTilesMap) => {
  const [tileX, tileY] = tile;
  const adjacents = [
    [tileX + 2, tileY],
    [tileX - 2, tileY],
    [tileX - 1, tileY + 1],
    [tileX - 1, tileY - 1],
    [tileX + 1, tileY + 1],
    [tileX + 1, tileY - 1],
  ];
  let noOfBlackAdjacents = 0;
  adjacents.forEach((tile) => {
    let key = tile.join(',');
    const val = whiteTilesMap.get(key);
    if (val) {
      whiteTilesMap.set(key, val + 1);
      return;
    }
    if (blackTilesMap.get(tile.join(',')) === 1) {
      noOfBlackAdjacents++;
    } else {
      whiteTilesMap.set(key, 1);
    }
  });
  return noOfBlackAdjacents;
};

module.exports = day24B;
