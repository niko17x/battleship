// Helper Functions:
// Functions and helpers:
const helperPlaceShip = (values, coord) => {
  if (values.includes(coord)) {
    return true;
  }
  return false;
};

// Returns the index position of object x value:
const getIndexPos = (coord, arr) => {
  const xValue = coord;
  return arr.indexOf(xValue);
};

// Creates instance of ship:
class Ship {
  constructor(shipClass, shipLength, hitCount) {
    this.shipClass = shipClass;
    this.shipLength = shipLength;
    this.hitCount = hitCount;
    this.coord = [];
    this.sunk = false;
  }

  updateCoord(x, y) {
    const xInBound = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const yInBound = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const xValues = helperPlaceShip(xInBound, x);
    const yValues = helperPlaceShip(yInBound, y);
    const shipOrient = "horizontal";

    // Validate user coord input is within range.
    if (xValues && yValues) {
      const firstCoord = { x, y }; // User input coordinates.
      this.coord.push(firstCoord);
      const alphaIndex = getIndexPos(firstCoord.x, xInBound); // Get index pos. of first coord x value.
      const numIndex = getIndexPos(firstCoord.y, yInBound); // Get index pos. of y value.

      if (shipOrient === "vertical") {
        // Vertical ship placement:
        for (let i = 1; i < this.shipLength; i++) {
          if (!this.coord[this.coord.length - 1].x) {
            this.coord = [];
            return;
          }
          this.coord.push({ x: xInBound[alphaIndex + i], y });
        }
      } else if (shipOrient === "horizontal") {
        // Horizontal placement:
        for (let i = 1; i < this.shipLength; i++) {
          if (!this.coord[this.coord.length - 1].y) {
            this.coord = [];
            return;
          }
          this.coord.push({ x, y: yInBound[numIndex + i] });
        }
      }
    }
  }

  // Increases the number of 'hits' in your ship:
  updateHitCount(hitPoint) {
    this.hitCount += hitPoint;
  }

  // Validate ship is sunk if length === hits:
  isSunk() {
    if (this.hitCount >= this.shipLength) {
      this.sunk = true;
      return true;
    }
    this.sunk = false;
    return false;
  }

  getCoord() {
    this.coord.placeCoord();
  }
}

// module.exports = Ship;
export { Ship };

// ! TEST AREA:
