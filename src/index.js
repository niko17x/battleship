// import _ from "lodash";
// import { create } from "/lodash.js";
import { GameBoard } from "./factories/gameBoard.js";
import { Player } from "./factories/player.js";

// Start of game loop => Create players and board:

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
playerOneBoard.createBoard();
// playerTwoBoard.createBoard();

// Create and display spaces that occupy each ship length:
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

// ! TEST:

// Populate the game board with predetermined coordinates for each ship:
// ? How can I place just one ship in the game board (Just focus on vertical placement)?
// ? How do I indicate that a ship is placed inside the game board? => Change the color of the div (make it transparent).

// Todo: Find a way to mark/"place" a ship on the board by changing the div color:

// parentDiv => pass in the parent div id. // id => pass in the child div id you're looking for.
const childDiv = (parentId, id) => {
  const parentDiv = document.getElementById(parentId); // Get the parent div id.
  for (const child of parentDiv.children) {
    if (child.id === id) {
      child.classList.add("active");
    }
  }
};

const foo = (selectParent, selectChild) => {
  const alphaClass = document.querySelectorAll(".alpha");
  alphaClass.forEach((div) => {
    if (div.id === selectParent) {
      if (childDiv(div.id, selectChild)) {
        div.classList.add("active");
      }
    }
  });
};
foo("D", "5");
foo("D", "6");
foo("D", "7");
foo("E", "7");
foo("F", "7");
foo("G", "7");
