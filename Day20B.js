const { getInput } = require('./utils');
const { equals, reverse } = require('ramda');

// Tile Borders
const XMIN = [0, null];
const YMIN = [null, 0];
const XMAX = [9, null];
const YMAX = [null, 9];
const BORDER_ORDER = [XMIN, YMAX, XMAX, YMIN];
/**********
 
    ----XMIN-----
    |           |
    |           |
  YMIN        YMAX
    |           |
    |           |
    ----XMAX-----
 
**********/

const day20B = async () => {
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
  let corners = [];
  let edges = {};
  let middles = {};
  tileBorders.forEach((val, key, map) => {
    if (Object.keys(val).length === 2) {
      corners.push(Number(key));
    }
  });

  let resultImage = new Array(120)
    .fill('0')
    .map(() => new Array(120).fill('0'));
  const resultGuide = new Array(12)
    .fill('0')
    .map(() => new Array(12).fill('0'));
  fillImage(resultImage, resultGuide, tiles, tileBorders, corners[0]);

  // Clean borders
  resultImage = cleanImage(resultImage);
  // Find and plot seaMonsters
  resultImage = findSeaMonsters(resultImage);
  print(resultImage);

  return resultImage.reduce(
    (acc, row) =>
      row.reduce((rowAcc, i) => (i === '#' ? rowAcc + 1 : rowAcc), acc),
    0
  );
};

/*****
                    # 
  #    ##    ##    ###
   #  #  #  #  #  #  
 *****/
const getMonsterTiles = (curr) => [
  [...curr],
  [curr[0], curr[1] + 5],
  [curr[0], curr[1] + 6],
  [curr[0], curr[1] + 11],
  [curr[0], curr[1] + 12],
  [curr[0], curr[1] + 17],
  [curr[0], curr[1] + 18],
  [curr[0], curr[1] + 19],
  [curr[0] - 1, curr[1] + 18],
  [curr[0] + 1, curr[1] + 1],
  [curr[0] + 1, curr[1] + 4],
  [curr[0] + 1, curr[1] + 7],
  [curr[0] + 1, curr[1] + 10],
  [curr[0] + 1, curr[1] + 13],
  [curr[0] + 1, curr[1] + 16],
];

const findSeaMonsters = (image) => {
  let temp = new Array(image.length)
    .fill('0')
    .map(() => new Array(image.length).fill('0'));
  insertTile(temp, image, 0, 0);
  let res = new Array(image.length)
    .fill('0')
    .map(() => new Array(image.length).fill('0'));
  let noOfMonsters = 0;
  let timesFlipped = 0;

  while (noOfMonsters === 0) {
    insertTile(res, temp, 0, 0);
    noOfMonsters = 0;
    for (let i = 0; i < temp.length; i++) {
      if (i === 0 || i === temp.length - 1) {
        continue;
      }
      for (let j = 0; j < temp.length; j++) {
        if (j + 19 >= temp.length) {
          continue;
        }
        const tilesToCheck = getMonsterTiles([i, j]);
        const monsterFound = tilesToCheck.reduce(
          (acc, tile) =>
            temp[tile[0]] &&
            temp[tile[0]][tile[1]] &&
            temp[tile[0]][tile[1]] === '#'
              ? acc + 1
              : acc,
          0
        );

        if (monsterFound === tilesToCheck.length) {
          noOfMonsters++;
          tilesToCheck.forEach((tile) => {
            res[tile[0]][tile[1]] = '0';
          });
        }
      }
    }
    if (!noOfMonsters) {
      if (timesFlipped % 2 === 0) {
        temp = rotateTile(temp);
      } else {
        temp = flipTile(temp, 1, 1);
      }
      timesFlipped++;
    }
  }
  return res;
};

const cleanImage = (image) => {
  let temp = new Array(120).fill('0').map(() => new Array(120).fill('0'));
  insertTile(temp, image, 0, 0);
  let colsToRemove = [];
  let rowsToRemove = [];
  for (let i = 0; i < 120; i += 10) {
    colsToRemove.push(i);
    rowsToRemove.push(i);
    colsToRemove.push(i + 9);
    rowsToRemove.push(i + 9);
  }
  rowsToRemove.forEach((rowId) => (temp[rowId] = null));
  temp = temp.filter(Boolean);
  temp.forEach((row, id) => {
    temp[id] = row.filter((_, index) => !colsToRemove.includes(index));
  });
  return temp;
};

const fillImage = (result, guide, tiles, borders, startTile) => {
  let nextTile = startTile;
  let borderToAlign = null;
  let shouldRotate = false;
  let currentTile = tiles.get(nextTile);
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
      insertTile(result, currentTile, i * 10, j * 10);
      // this array is used to get the spatial map of the tiles already inserted
      guide[i][j] = nextTile;

      // Determine next tile to insert
      let nextTileCandidates;
      let borderToCompare;
      let tileToCompare;
      let tileId;
      if (j === 11) {
        // if last column, the next tile to insert will be in the next line
        // so I use the first tile of the current line as reference for that
        tileId = guide[i][0];
        borderToCompare = XMAX;
      } else {
        tileId = guide[i][j];
        borderToCompare = YMAX;
      }
      nextTileCandidates = borders.get(tileId);
      tileToCompare = tiles.get(tileId);

      for (let k = 0; k < Object.keys(nextTileCandidates).length; k++) {
        // from the possible candidates determined earlier, get the right one
        const toCompareBorder = getBorder(borderToCompare, tileToCompare);
        const candidateTileNumber = Number(Object.keys(nextTileCandidates)[k]);
        const candidatesBorders = borders.get(candidateTileNumber);
        const candidateBorder = candidatesBorders[`${tileId}`];
        const candidateTile = tiles.get(candidateTileNumber);

        if (
          equals(toCompareBorder, getBorder(candidateBorder, candidateTile)) ||
          equals(
            toCompareBorder,
            reverse(getBorder(candidateBorder, candidateTile))
          )
        ) {
          let requiredAlignment;
          let rotateAlong;

          // At this point we know which is the next tile we will insert
          // but the tile now needs to be flipped the right direction
          // and rotated if necessary
          nextTile = candidateTileNumber;
          borderToAlign = candidateBorder;
          currentTile = tiles.get(nextTile);

          if (j === 11) {
            requiredAlignment = XMIN;
            rotateAlong = 'y';
          } else {
            requiredAlignment = YMIN;
            rotateAlong = 'x';
          }

          if (!equals(requiredAlignment, borderToAlign)) {
            let destDir = BORDER_ORDER.findIndex((dir) =>
              equals(requiredAlignment, dir)
            );
            let currDir = BORDER_ORDER.findIndex((dir) =>
              equals(borderToAlign, dir)
            );
            let diff = destDir - currDir;
            currentTile = flipTile(
              currentTile,
              Math.abs(diff),
              Math.sign(diff)
            );
            if (
              equals(
                toCompareBorder,
                reverse(getBorder(requiredAlignment, currentTile))
              )
            ) {
              // After flipping check if rotation is necessary
              currentTile = rotateTile(currentTile, rotateAlong);
            }
            tiles.set(nextTile, currentTile);
          } else if (
            equals(
              toCompareBorder,
              reverse(getBorder(borderToAlign, currentTile))
            )
          ) {
            currentTile = rotateTile(currentTile, rotateAlong);
            tiles.set(nextTile, currentTile);
          }
          break;
        }
      }
    }
  }
};

const print = (tile) => {
  for (let i = 0; i < tile.length; i++) {
    for (let j = 0; j < tile.length; j++) {
      if (tile[i][j] === '0') {
        process.stdout.write('\x1b[91m0\x1b[39m');
      } else {
        process.stdout.write(tile[i][j]);
      }
    }
    console.log('');
  }
};

const insertTile = (parent, tile, startX, startY) => {
  for (let i = 0; i < tile.length; i++) {
    for (let j = 0; j < tile.length; j++) {
      parent[startX + i][startY + j] = tile[i][j];
    }
  }
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

const flipTile = (tile, times = 1, direction) => {
  const result = new Array(tile.length)
    .fill('0')
    .map(() => new Array(tile.length).fill('0'));

  const lastIndex = tile.length - 1;
  for (let i = 0; i < tile.length; i++) {
    for (let j = 0; j < tile.length; j++) {
      if (direction > 0) {
        result[j][lastIndex - i] = tile[i][j];
      } else {
        result[lastIndex - j][i] = tile[i][j];
      }
    }
  }
  return times > 1 ? flipTile(result, times - 1, direction) : result;
};

const rotateTile = (tile, direction = 'x') => {
  const result = new Array(tile.length)
    .fill('0')
    .map(() => new Array(tile.length).fill('0'));

  const lastIndex = tile.length - 1;
  for (let i = 0; i < tile.length; i++) {
    for (let j = 0; j < tile.length; j++) {
      if (direction === 'x') {
        result[lastIndex - i][j] = tile[i][j];
      } else {
        result[i][lastIndex - j] = tile[i][j];
      }
    }
  }
  return result;
};

const getBorder = (border, tile) => {
  const [x, y] = border;
  if (typeof x === 'number') {
    return tile[x].map((t) => t);
  } else {
    return tile.map((t) => t[y]);
  }
};

module.exports = day20B;
