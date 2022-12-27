import { GameBoard } from "./gameBoard.js";
import { Ship } from "./ships.js";

class Player {
  constructor(name) {
    this.name = name;
    this.ships = [];
    this.moves = [{ hits: [] }, { misses: [] }];
  }

  // Add default ships for start of game:
  defaultShips() {
    const carrier = new Ship("Carrier", 5, 0);
    const battleShip = new Ship("Battle-Ship", 4, 0);
    const destroyer = new Ship("Destroyer", 3, 0);
    const submarine1 = new Ship("Submarine-1", 2, 0);
    const submarine2 = new Ship("Submarine-2", 2, 0);
    const patrolBoat1 = new Ship("Patrol-Boat-1", 1, 0);
    const patrolBoat2 = new Ship("Patrol-Boat-2", 1, 0);
    this.ships.push(
      carrier,
      battleShip,
      destroyer,
      submarine1,
      submarine2,
      patrolBoat1,
      patrolBoat2
    );
  }

  // Get player target coordinate:
  // Note: Change to click events for coordinates instead of manual input.
  attackCoord(board) {
    // Call GameBoard.receiveAttack() to get the 'hit' shipClass name and update the shipClass hit count.
    return board;
  }

  // Run Gameboard.receiveAttack() => method returns a shipClass if there is a hit => go through Player.ships and find matching shipClass to 'take damage' and record hit.
}
export { Player };

//! TEST AREA:
