const Ship = require("./ships");

// Functions and helpers:
const helperPlaceShip = (values, coord) => {
  if (values.includes(coord)) {
    return true;
  }
  return false;
};

// Returns the index position of X:
const getIndexPos = (coord, alphaList) => {
  const xValue = coord.x;
  return alphaList.indexOf(xValue);
};

// Main class:
class GameBoard {
  constructor(ship) {
    this.ship = ship;
    this.coord = [];
  }

  // Get placement of ship (x: a-j), (y: 1-10):
  placeShip(x, y) {
    const xInBound = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const yInBound = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const xValues = helperPlaceShip(xInBound, x);
    const yValues = helperPlaceShip(yInBound, y);

    // Validate user coord input is within range.
    if (xValues && yValues) {
      const firstCoord = { x, y }; // User input coordinates.
      this.coord.push(firstCoord);
      const alphaIndex = getIndexPos(firstCoord, xInBound); // Get index pos. of first coord x value.

      // Increment coord of x value for vertical ship placement
      for (let i = 1; i < this.ship.shipLength; i++) {
        this.coord.push({
          x: xInBound[alphaIndex + i],
          y,
        });
      }
    } else {
      return null; // Out of bounds coord input.
    }
  }

  getLen() {
    console.log(this.ship.shipLength);
  }
}

module.exports = GameBoard;

const carrier = new Ship("carrier", 4, 0);
const board = new GameBoard(carrier);
board.placeShip("z", 10);
console.log(board.coord);
