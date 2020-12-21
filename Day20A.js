const { getInput } = require('./utils');
const { equals, reverse } = require('ramda');
const ruleExpansionCache = new Map();
// Tile Borders
const XMIN = [0, null];
const YMIN = [null, 0];
const XMAX = [9, null];
const YMAX = [null, 9];

const day20A = async () => {
  const input = await getInput('20', '\n\n');

  // Tiles map of form
  // Number -> 2D array of chars
  // TileID -> images
  const tiles = input.reduce((acc, i) => {
    const lines = i.split('\n');
    const tileNo = Number(lines[0].match(/[0-9]+/i)[0]);
    const arr = lines.slice(1).map((x) => x.split(''));
    return acc.set(tileNo, arr);
  }, new Map());

  // Map to contain tiles and their neighbours
  // Number -> Object
  // Tile no -> { NeighbourTileNo1: shared side, NeighbourTileNo2: shared side, ... }
  const tileBorders = new Map();
  tiles.forEach((tileArray, tileNo, tiles) =>
    updateTileBorderBuddies(tileNo, tileArray, tileBorders, tiles)
  );
  const corners = [];
  tileBorders.forEach(
    (val, key) => Object.keys(val).length === 2 && corners.push(key)
  );
  return corners.reduce((acc, tileId) => acc * tileId, 1);
};

const updateTileBorderBuddies = (tileNo, tileArray, tileBorders, allTiles) => {
  const existingBorders = tileBorders.get(tileNo);
  // all border buddies for this tile have already been found
  if (existingBorders && Object.keys(existingBorders).length >= 4) {
    return;
  }

  // every tile has four borders - x=0, y=0, x=9, y=9
  // represented by - [0, null], [null, 0], [9, null], [null, 9]
  // compare every border of every tile with every border of every other tile
  // till we find a max of four border buddies

  for (const buddy of allTiles) {
    const [buddyNo, arr] = buddy;
    if (buddyNo === tileNo) return;
    const currentTileBorders = [XMIN, YMIN, XMAX, YMAX];
    const buddyBorders = [XMIN, YMIN, XMAX, YMAX];

    for (let i = 0; i < currentTileBorders.length; i++) {
      for (let j = 0; j < buddyBorders.length; j++) {
        let borderA = getBorder(currentTileBorders[i], tileArray);
        let borderB = getBorder(buddyBorders[j], arr);
        if (equals(borderA, borderB) || equals(borderA, reverse(borderB))) {
          let existingTileBorders = tileBorders.get(tileNo);
          let existingBuddyBorders = tileBorders.get(buddyNo);
          tileBorders.set(
            tileNo,
            Object.assign({}, existingTileBorders, {
              [buddyNo]: currentTileBorders[i],
            })
          );
          tileBorders.set(
            buddyNo,
            Object.assign({}, existingBuddyBorders, {
              [tileNo]: buddyBorders[j],
            })
          );
          if (
            existingTileBorders &&
            Object.keys(existingTileBorders).length + 1 >= 4
          ) {
            return;
          }
        }
      }
    }
  }
  return;
};

const getBorder = (border, tile) => {
  const [x, y] = border;
  if (typeof x === 'number') {
    return tile[x];
  } else {
    return tile.map((t) => t[y]);
  }
};

module.exports = day20A;
