// import _ from "lodash";
// import { create } from "/lodash.js";
import { GameBoard } from "./factories/gameBoard.js";
import { Player } from "./factories/player.js";
import { Ship } from "./factories/ships.js";

const printWindow = () => {
  window.addEventListener("click", (e) => {
    console.log(e.target.parentNode.id, e.target.id);
    // if (e.target.classList.contains("active")) { // => Div with '.active' class (ship occupied).
    //   console.log(e.target);
    // }
  });
};
printWindow();

// Create player instances:
const playerOne = new Player("Player One");
const playerTwo = new Player("Player Two");

// Create game board instances:
const playerOneBoard = new GameBoard();
const playerTwoBoard = new GameBoard();

// Add default ships to players:
playerOne.defaultShips();
playerTwo.defaultShips();

// Creating a board:
playerOneBoard.createBoard(".player-1-board");
playerTwoBoard.createBoard(".player-2-board");

// Takes players ships and displays on page as 'div spaces' based on ship length to indicate the available ships:
const displayShips = (player) => {
  player.ships.forEach((obj) => {
    const container = document.querySelector(".container");
    const ship = document.createElement("div");
    // ship.classList.add(`${obj.shipClass}`);
    for (let i = 0; i < obj.shipLength; i++) {
      const div = document.createElement("div");
      div.classList.add("space");
      ship.append(div);
    }
    container.append(ship);
  });
};
// displayShips(playerOne);

// * Deal with default placement of ships (non-randomized or selected coordinates):
// Ships = [Carrier, Battle-Ship, Destroyer, Submarine-1, Submarine-2, Patrol-Boat-1, Patrol-Boat-2];

// Sets coordinate positions based on parameter input:
const setShipCoord = (player, shipType, x, y) => {
  player.ships.forEach((obj) => {
    // If param shipType has a matching ship, run updateCoord() method:
    if (obj.shipClass === shipType) {
      obj.updateCoord(x, y);
    }
  });
};
// setShipCoord(playerOne, "Carrier", "A", 5); // => i.e.

// Places ships in their default board coordinate positions:
const defaultShipPos = (player) => {
  setShipCoord(player, "Carrier", "A", 1);
  setShipCoord(player, "Battle-Ship", "H", 3);
  setShipCoord(player, "Destroyer", "J", 6);
  setShipCoord(player, "Submarine-1", "D", 7);
  setShipCoord(player, "Submarine-2", "G", 3);
  setShipCoord(player, "Patrol-Boat-1", "A", 10);
  setShipCoord(player, "Patrol-Boat-2", "E", 3);
};
defaultShipPos(playerOne);
defaultShipPos(playerTwo);

// Todo: Coordinate placements for player 2 is not registering b/c the coords A-J and 1-10 are the same for both player 1 board and player 2 board (they are referring to the exact same coordinates) => Must find a way differentiate the coord for player 1 and player 2.

// Returns an array of each ship coordinate for selected player:
const getLoc = (player) => {
  let locations = [];
  player.ships.forEach((ship) => {
    ship.coord.forEach((loc) => {
      locations.push([loc.x, loc.y]);
    });
  });
  return locations;
};

// Takes input from getLoc() function and uses data to place 'active' classes to div:
const markBoard = (pBoard) => {
  const parentDiv = document.querySelector(`.${pBoard}`);

  getLoc(playerTwo).forEach((obj) => {
    let getX = parentDiv.querySelector(`#${obj[0]}`);
    getX.childNodes.forEach((item) => {
      if (item.id === obj[1].toString()) {
        item.classList.add("active");
      }
    });
  });
};

markBoard("player-2-board");
markBoard("player-1-board");
