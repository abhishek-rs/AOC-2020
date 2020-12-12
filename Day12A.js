const { getInput } = require('./utils');

/***********
Compass:

    N
  W   E
    S

************/
const DIRECTIONS = ['N', 'E', 'S', 'W'];

const day12A = async () => {
  const input = await getInput('12', '\n');
  let shipState = {
    dir: 'E',
    coords: [0, 0],
  };

  input.forEach((instruc) => {
    switch (instruc[0]) {
      case 'L':
      case 'R':
        shipState.dir = executeTurn(shipState.dir, instruc);
        break;
      case 'N':
      case 'S':
      case 'W':
      case 'E':
        shipState.coords = executeMovement(shipState.coords, instruc);
        break;
      case 'F':
        shipState.coords = executeMovement(
          shipState.coords,
          instruc,
          shipState.dir
        );
        break;
      default:
        break;
    }
  });

  return Math.abs(shipState.coords[0]) + Math.abs(shipState.coords[1]);
};

const executeMovement = (currentCoords, instruction, forwardDir = null) => {
  const [insDir, distance] = [
    forwardDir ? forwardDir : instruction[0],
    Number(instruction.slice(1)),
  ];
  const sign = insDir === 'E' || insDir === 'N' ? 1 : -1;
  return insDir === 'E' || insDir === 'W'
    ? [currentCoords[0] + sign * distance, currentCoords[1]]
    : [currentCoords[0], currentCoords[1] + sign * distance];
};

const executeTurn = (currentDirection, instruction) => {
  const [insDir, insAngle] = [instruction[0], Number(instruction.slice(1))];
  const currDir = DIRECTIONS.findIndex((x) => x === currentDirection);
  const finalDirIndex =
    insDir === 'L' ? currDir - insAngle / 90 : currDir + insAngle / 90;
  return DIRECTIONS[
    finalDirIndex < 0
      ? DIRECTIONS.length + finalDirIndex
      : finalDirIndex % DIRECTIONS.length
  ];
};

module.exports = day12A;
