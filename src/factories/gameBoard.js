import { Ship } from "./ships.js";
import { Player } from "./player.js";
// const Ship = require("./ships");
// const Player = require("./player");

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
  // 'target' takes object coord => i.e. { x:'a', y: 2}
  receiveAttack(defaultShips, target) {
    //* Use GameBoard.receiveAttack() to call this function.
    let hitShip = false;
    // 'defaultShips' parameter for => playerOne.ships => 'playerOne' is instance of Player class.
    defaultShips.forEach((obj) => {
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

  // Gets shipClass from method receiveAttack() and updates the hit count of that ship:
  static markHit(defaultShip, shipClass) {
    // Iterate through 'ships' and find the class name that matches:
    const findHitShip = defaultShip.find(
      (prop) => prop.shipClass === shipClass
    );
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

// module.exports = GameBoard;
export { GameBoard };

const gameBoard = new GameBoard();

// const player = new Player("bro");
// player.defaultShips();
// player.receiveAttack(player.ships, targetCoord("b", 2)); => Method does NOT exist in Player class.
