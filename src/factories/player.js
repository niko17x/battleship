import { GameBoard } from "./gameBoard.js";
import { Ship } from "./ships.js";

class Player {
  constructor(name) {
    this.name = name;
    this.ships = [];
    this.moves = [];
  }

  // Set default ships for start of game:
  defaultShips() {
    const carrier = new Ship("Carrier", 5, 0);
    const battleShip = new Ship("Battle Ship", 4, 0);
    const destroyer = new Ship("Destroyer", 3, 0);
    const submarine = new Ship("Submarine", 3, 0);
    const patrolBoat = new Ship("Patrol Boat", 2, 0);
    this.ships.push(carrier, battleShip, destroyer, submarine, patrolBoat);
  }

  // Get player target coordinate:
  // Note: Change to click events for coordinates instead of manual input.
  attackCoord(board) {
    // Call GameBoard.receiveAttack() to get the 'hit' shipClass name and update the shipClass hit count.
    return board;
  }

  // Run Gameboard.receiveAttack() => method returns a shipClass if there is a hit => go through Player.ships and find matching shipClass to 'take damage' and record hit.
}

// module.exports = Player;
export { Player };

const playerOne = new Player("Player One");
const playerTwo = new Player("Player Two");

playerOne.defaultShips(); // Adds default ships to player.
// playerOne.attackCoord("hello");
playerOne.attackCoord();
