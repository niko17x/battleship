// import _ from "lodash";
// import { create } from "/lodash.js";
import { GameBoard } from "./factories/gameBoard.js";
import { Player } from "./factories/player.js";
import { Ship } from "./factories/ships.js";

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

// Iterate through each child node of given parent node and if matching child.id found, add '.active' class to it:
// parentDiv => pass in the parent div id. // id => pass in the child div id you're looking for.
const checkChildId = (parentId, id) => {
  const parentDiv = document.getElementById(parentId); // Get the parent div id.
  for (const child of parentDiv.children) {
    if (child.id === id) {
      child.classList.add("active");
    }
  }
};

// Valid parent and child id parameters allows the targeted div's to add 'active' class using function - checkChildId(); :
const markBoard = (selectParentId, selectChildId) => {
  const alphaClass = document.querySelectorAll(".alpha");
  alphaClass.forEach((div) => {
    // If matching parent id found... :
    if (div.id === selectParentId) {
      return checkChildId(div.id, selectChildId);
    }
  });
};

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
  setShipCoord(player, "Carrier", "B", 1);
  setShipCoord(player, "Battle-Ship", "H", 3);
  setShipCoord(player, "Destroyer", "J", 6);
  setShipCoord(player, "Submarine-1", "D", 7);
  setShipCoord(player, "Submarine-2", "G", 3);
  setShipCoord(player, "Patrol-Boat-1", "A", 10);
  setShipCoord(player, "Patrol-Boat-2", "E", 3);
};
defaultShipPos(playerOne);
defaultShipPos(playerTwo);

// Takes ships (** w/ existing coords) and places them on game board:
const placeShipOnBoard = (player) => {
  player.ships.forEach((ship) => {
    ship.coord.forEach((coord) => {
      const x = coord.x.toString(); // Parent id => alphas.
      const y = coord.y.toString(); // Child id => integers.
      markBoard(x, y);
    });
  });
};
placeShipOnBoard(playerOne);
placeShipOnBoard(playerTwo);

const printWindow = () => {
  window.addEventListener("click", (e) => {
    console.log(e.target.parentNode.id, e.target.id);
    // if (e.target.classList.contains("active")) { // => Div with '.active' class (ship occupied).
    //   console.log(e.target);
    // }
  });
};
printWindow();

// ! TEST:

// Todo: Coordinate placements for player 2 is not registering b/c the coords A-J and 1-10 are the same for both player 1 board and player 2 board (they are referring to the exact same coordinates) => Must find a way differentiate them.
