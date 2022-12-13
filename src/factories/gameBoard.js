const Ship = require("./ships");

const targetCoord = (alpha, num) => ({ x: alpha, y: num }); // User targeted coord (example only);

// Main class:
class GameBoard {
  constructor() {
    this.ships = [];
    this.missedShots = []; // Tracks missed attacks.
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
      // Push missed coord:
      if (hitShip === false && !this.missedShots.includes(target)) {
        this.missedShots.push(target);
      }
    });
    return hitShip;
  }

  // Takes shipClass from receiveAttack()
  markHit(shipClass) {
    // Iterate through 'ships' and find the class name that matches:
    const findHitShip = this.ships.find((prop) => prop.shipClass === shipClass);
    const hitTargetShip = findHitShip.updateHitCount(1);
    // Check if the ship has sunk:
    findHitShip.isSunk();
    return hitTargetShip;
  }

  // Validate if all ships have been sunk:
  allShipsSunk() {
    let allSunk;
    this.ships.forEach((ship) => {
      if (ship.sunk === true) {
        allSunk = true;
      } else {
        allSunk = false;
      }
    });
    return allSunk;
  }
}
const gameBoard = new GameBoard();

const carrier = new Ship("Carrier", 5, 0);
carrier.updateCoord("a", 2);
carrier.updateHitCount(5);
carrier.isSunk();

const battle = new Ship("Battle", 4, 0);
battle.updateCoord("b", 1);

gameBoard.placeShip(battle);
gameBoard.placeShip(carrier);
// gameBoard.receiveAttack(targetCoord);

gameBoard.receiveAttack(targetCoord("b", 1));
gameBoard.receiveAttack(targetCoord("b", 2));
gameBoard.receiveAttack(targetCoord("b", 3));
gameBoard.receiveAttack(targetCoord("b", 4));

// console.log(gameBoard);
console.log(gameBoard.allShipsSunk());
