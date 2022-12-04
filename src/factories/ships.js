class Ship {
  constructor(shipClass, shipLength, hitCount) {
    this.shipClass = shipClass;
    this.shipLength = shipLength;
    this.hitCount = hitCount;
    this.sunk = false;
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
}

module.exports = Ship;
