const Ship = require("./ships");

const targetCoord = { x: "b", y: 3 }; // User targeted coord (example).

// Main class:
class GameBoard {
  constructor() {
    this.ships = [];
    this.missedShots = [];
  }

  // Function that returns the ship instance coordinates:
  placeShip(ship) {
    this.ships.push(ship);
    return ship.coord;
  }

  // Return the shipClass if target coord has matching ship coord:
  receiveAttack(target) {
    //* Use GameBoard.receiveAttack() to call this function.
    let hitShip = false;
    this.ships.forEach((obj) => {
      // Within each ship object, check each coordinate.
      for (let i = 0; i < obj.coord.length; i++) {
        // If targetCoord matches existing coord, record the ship that was hit:
        if (target.x === obj.coord[i].x && target.y === obj.coord[i].y) {
          hitShip = obj.shipClass;
          this.markHit(hitShip); // ship.updateHitCount(1);
        }
      }
      if (hitShip === false && !this.missedShots.includes(target)) {
        this.missedShots.push(target);
      }
    });
    return hitShip; // => returns shipClass.
  }

  // Takes shipClass from receiveAttack()
  markHit(shipClass) {
    // Iterate through 'ships' and find the class name that matches:
    const findHitShip = this.ships.find((prop) => prop.shipClass === shipClass);
    return findHitShip.updateHitCount(1);
  }
}
const gameBoard = new GameBoard();
const carrier = new Ship("Carrier", 5, 0);
carrier.updateCoord("a", 2);
const battle = new Ship("Battle", 4, 0);
battle.updateCoord("b", 1);
gameBoard.placeShip(battle);
gameBoard.placeShip(carrier);
gameBoard.receiveAttack(targetCoord);
console.log(gameBoard);
