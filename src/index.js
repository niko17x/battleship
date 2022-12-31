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
// printWindow();

let playGame = true;

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

// Deal with taking player turns:
let playerOneTurn = true;
const togglePlayerTurn = () => {
  if (playerOneTurn) {
    playerOneTurn = false;
  } else {
    playerOneTurn = true;
  }
};

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

// *** Deal with default placement of ships (non-randomized or selected coordinates) ***
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

// *** Dealing with attacking coordinates based on user clicking on the div which in turn, edits the coords for the the affected ship. ***
// Takes player turns attacking board and registers hits and misses to the correct player class properties:
const renderBoardClick = (playerTurn, e, playerBoard, player) => {
  const getParentNode = e.target.parentNode.parentNode;
  const getChildClass = e.target.classList;
  if (playerTurn) {
    // Player gets a 'hit' on opponent game board when targeted div contains 'active' class:
    if (getParentNode.classList.contains(playerBoard)) {
      if (getChildClass.contains("active")) {
        getChildClass.remove("active");
        getChildClass.add("hit");
        player.moves[0].hits.push([e.target.parentNode.id, e.target.id]);
        console.log(player.moves[0].hits);
        const hitShip = getHitShipClass(
          player,
          e.target.parentNode.id,
          e.target.id
        );
        GameBoard.markHit(player.ships, hitShip);
      } else {
        // Account for duplicate clicks on div's containing 'active/hit' classes:
        player.missed(e.target.parentNode.id, e.target.id); // => pushes missed coord into player.move property.
        if (
          e.target.classList.contains("missed") ||
          e.target.classList.contains("hit")
        )
          return;
        e.target.classList.add("missed");
      }
      togglePlayerTurn();
    }
  }
  checkSunkShips(player);
  areAllShipsSunk(player);
};

// Event handler for function 'renderBoardClick()':
document.querySelector(".board").addEventListener("click", (e) => {
  renderBoardClick(playerOneTurn, e, "player-2-board", playerOne);
  renderBoardClick(!playerOneTurn, e, "player-1-board", playerTwo);
});

// Takes x, y from renderBoardClick() function and locates ship (if any) and returns the shipClass to be used in another function:
const getHitShipClass = (player, x, y) => {
  let targetShip;
  player.ships.forEach((ship) => {
    ship.coord.forEach((loc) => {
      if (loc.x === x && loc.y.toString() === y) {
        targetShip = ship.shipClass;
        return;
      }
    });
  });
  return targetShip;
};
// getHitShipClass(playerOne, "H", "3");

// Checks for every ship if it is 'sunk' and if sunk, the players ship will be edited to return a list of ships that are NOT yet sunk which effectively removes the sunk ship from the list of ships:
const checkSunkShips = (player) => {
  player.ships.forEach((ship) => {
    if (ship.sunk) {
      player.ships = player.ships.filter((shipObj) => shipObj !== ship);
    }
  });
};

// If length of player ship property is 0, game is lost (sunk ships are filtered out):
const areAllShipsSunk = (player) => {
  // Since sunk ships will be removed from the property, check length:
  if (player.ships.length === 0) {
    console.log(`${player} has lost the game!`);
  }
  playGame = false;
};
