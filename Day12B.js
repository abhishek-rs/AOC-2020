const { getInput } = require('./utils');

/***********
Compass:

    N
  W   E
    S

************/
const DIRECTIONS = ['N', 'E', 'S', 'W'];

const day12B = async () => {
  const input = await getInput('12', '\n');
  let shipState = {
    coords: [0, 0],
  };
  let wayPointState = {
    coords: [10, 1],
  };

  input.forEach((instruc) => {
    switch (instruc[0]) {
      case 'L':
      case 'R':
        wayPointState.coords = executeTurn(wayPointState.coords, instruc);
        break;
      case 'N':
      case 'S':
      case 'W':
      case 'E':
        wayPointState.coords = executeMovement(wayPointState.coords, instruc);
        break;
      case 'F':
        shipState.coords = moveShip(
          shipState.coords,
          instruc,
          wayPointState.coords
        );
        break;
      default:
        break;
    }
  });

  return Math.abs(shipState.coords[0]) + Math.abs(shipState.coords[1]);
};

const executeMovement = (currentCoords, instruction) => {
  const [insDir, distance] = [instruction[0], Number(instruction.slice(1))];
  const sign = insDir === 'E' || insDir === 'N' ? 1 : -1;
  return insDir === 'E' || insDir === 'W'
    ? [currentCoords[0] + sign * distance, currentCoords[1]]
    : [currentCoords[0], currentCoords[1] + sign * distance];
};

const executeTurn = (currentCoords, instruction) => {
  const [insDir, insAngle] = [instruction[0], Number(instruction.slice(1))];
  switch (insAngle) {
    case 180:
      return [-currentCoords[0], -currentCoords[1]];
    case 90:
      return insDir === 'L'
        ? [-currentCoords[1], currentCoords[0]]
        : [currentCoords[1], -currentCoords[0]];
    case 270:
      return insDir === 'L'
        ? [currentCoords[1], -currentCoords[0]]
        : [-currentCoords[1], currentCoords[0]];
    default:
      return currentCoords;
  }
};

const moveShip = (shipCoords, instruction, wayPointCoords) => {
  const times = Number(instruction.slice(1));
  return [
    shipCoords[0] + times * wayPointCoords[0],
    shipCoords[1] + times * wayPointCoords[1],
  ];
};

module.exports = day12B;
