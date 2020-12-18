const { getInput } = require('./utils');

const day17A = async () => {
  let input = await getInput('17', '\n');
  input = input.map((i) => i.split(''));

  // Map of form:
  // 'x,y,z' => '#.....'
  // String => String
  // coordinates => cube state before each cycle

  const pocketDimension = input.reduce(
    (acc, row, x) =>
      row.reduce((acc2, col, y) => acc.set(`${x},${y},0`, col), acc),
    new Map()
  );

  for (let i = 0; i < 6; i++) {
    runCycle(pocketDimension, i);
  }

  return Array.from(pocketDimension.values()).reduce(
    (acc, val) => (val[6] === '#' ? acc + 1 : acc),
    0
  );
};

const runCycle = (map, cycleNo) => {
  map.forEach((val, coords) => {
    if (val.length > cycleNo + 1) return;
    let [x, y, z] = coords.split(',').map(Number);
    let noOfAdjacentActives = 0;
    for (i = x - 1; i < x + 2; i++) {
      for (j = y - 1; j < y + 2; j++) {
        for (k = z - 1; k < z + 2; k++) {
          let valAt = getValueAt(
            `${i},${j},${k}`,
            map,
            cycleNo,
            val[cycleNo] === '#'
          );
          valAt === '#' &&
            (i != x || j != y || k != z) &&
            noOfAdjacentActives++;
        }
      }
    }
    if (val[cycleNo] === '.' && noOfAdjacentActives === 3) {
      map.set(coords, val + '#');
    } else if (
      val[cycleNo] === '#' &&
      (noOfAdjacentActives === 3 || noOfAdjacentActives === 2)
    ) {
      map.set(coords, val + '#');
    } else {
      map.set(coords, val + '.');
    }
  });
};

const getValueAt = (coords, map, cycleNo, isAdjActive) => {
  let val = map.get(coords);
  if (val) {
    return val[cycleNo];
  } else if (isAdjActive) {
    // We will only need to worry about this cube if
    // it has a adjacent cube that is also active
    // so only add it to the map if that is the case
    let input = '';
    let i = 0;
    while (i <= cycleNo) {
      input = input + '.';
      i++;
    }
    map.set(coords, input);
    return '.';
  }
  return '.';
};

module.exports = day17A;
