// import _ from "lodash";
// import { create } from "/lodash.js";
import { GameBoard } from "./factories/gameBoard.js";
import { Player } from "./factories/player.js";
import { Ship } from "./factories/ships.js";

const printWindow = () => {
  window.addEventListener("click", (e) => {
    // console.log(e.target.parentNode.id, e.target.id);
    console.log(playGame);
  });
};
// printWindow();

let playGame = true;
// let playGame = false;

// Create player instances:
const playerOne = new Player("Player One");
const playerTwo = new Player("Player Two");

// Create game board instances:
const playerOneBoard = new GameBoard();
const playerTwoBoard = new GameBoard();

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
    const p1Board = document.querySelector(".player-1-board");
    const ship = document.createElement("div");
    // ship.classList.add(`${obj.shipClass}`);
    for (let i = 0; i < obj.shipLength; i++) {
      const div = document.createElement("div");
      div.classList.add("space");
      ship.append(div);
    }
    p1Board.append(ship);
  });
};

// *** Deal with default placement of ships (non-randomized or selected coordinates) ***
// Ships = [Carrier, Battle-Ship, Destroyer, Submarine-1, Submarine-2, Patrol-Boat-1, Patrol-Boat-2];

// Sets coordinate positions based on parameter input:
function setShipCoord(player, shipType, x, y) {
  player.ships.forEach((ship) => {
    // If param shipType has a matching ship, run updateCoord() method:
    if (ship.shipClass === shipType) {
      ship.updateCoord(x, y);
    }
  });
}
// setShipCoord(playerOne, "Carrier", "A", 5); // => i.e.

// Places ships in their default board coordinate positions:
function defaultShipPos(player) {
  // setShipCoord(player, "Carrier", "A", 1);
  // setShipCoord(player, "Battle-Ship", "H", 3);
  // setShipCoord(player, "Destroyer", "J", 6);
  // setShipCoord(player, "Submarine-1", "D", 7);
  // setShipCoord(player, "Submarine-2", "G", 3);
  // setShipCoord(player, "Patrol-Boat-1", "A", 10);
  setShipCoord(player, "Patrol-Boat-2", "E", 3);
}

// Returns an array of each ship coordinate for selected player:
function getLoc(player) {
  let locations = [];
  player.ships.forEach((ship) => {
    ship.coord.forEach((loc) => {
      locations.push([loc.x, loc.y]);
    });
  });
  return locations;
}

// Takes input from getLoc() function and uses data to place 'active' classes to div:
function markBoard(player) {
  let playerBoard;
  if (player === playerOne) {
    playerBoard = document.querySelector(".player-1-board");
  } else {
    playerBoard = document.querySelector(".player-2-board");
  }

  getLoc(player).forEach((obj) => {
    let xValue = playerBoard.querySelector(`#${obj[0]}`);
    xValue.childNodes.forEach((item) => {
      if (item.id === obj[1].toString()) {
        item.classList.add("active");
      }
    });
  });
}

// *** Dealing with attacking coordinates based on user clicking on the div which in turn, edits the coords for the the affected ship. ***
// Takes player turns attacking board and registers hits and misses to the correct player class properties:
function renderBoardClick(e, playerBoard, player) {
  const getParentNode = e.target.parentNode.parentNode;
  const getChildClass = e.target.classList;

  // Player gets a 'hit' on opponent game board when targeted div contains 'active' class:
  if (getParentNode.classList.contains(playerBoard)) {
    if (getChildClass.contains("active")) {
      getChildClass.remove("active");
      getChildClass.add("hit");
      player.moves[0].hits.push([e.target.parentNode.id, e.target.id]);
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

  checkSunkShips(player);
  getWinner(playerOne, "Player One");
  getWinner(playerTwo, "Player Two");
  displayScores();
  createPlayAgainBtn();
}

// Event handler for function 'renderBoardClick()':
function acceptClick() {
  document.querySelector(".board").addEventListener("click", (e) => {
    if (playGame) {
      if (e.target.classList.contains("num")) {
        if (playerOneTurn) {
          renderBoardClick(e, "player-2-board", playerOne);
        } else if (!playerOneTurn) {
          renderBoardClick(e, "player-1-board", playerTwo);
        }
      }
    }
  });
}

// Takes x, y from renderBoardClick() function and locates ship (if any) and returns the shipClass to be used in another function:
function getHitShipClass(player, x, y) {
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
}

// Checks for every ship if it is 'sunk' and if sunk, the players ship will be edited to return a list of ships that are NOT yet sunk which effectively removes the sunk ship from the list of ships:
function checkSunkShips(player) {
  player.ships.forEach((ship) => {
    if (ship.sunk) {
      player.ships = player.ships.filter((shipObj) => shipObj !== ship);
    }
  });
}

// Checks both players if there are no more ships (all sunk):
function recSunkShips(player) {
  // Go through each ship.sunk and check if all ships have been sunk:
  let allSunk = [];
  player.ships.forEach((ship) => {
    if (ship.sunk) {
      allSunk.push(true);
    } else {
      allSunk.push(false);
    }
  });
  return allSunk;
}

// Checks if all ships have been sunk or not:
function allShipsSunk(player) {
  // Returns true if all ships have been sunk:
  if (recSunkShips(player).every((item) => item === true)) {
    return true;
  } else {
    return false;
  }
}

function getWinner(player, winner) {
  if (allShipsSunk(player)) {
    player.addWin();
    displayWinner(`${winner}`);
    playGame = false;
  }
}

// Takes data from 'recSunkShips()' and uses DOM to add winner to display onto page:
function displayWinner(winner) {
  const dispWin = document.querySelector(".display-winner");
  dispWin.innerText = `${winner} wins!`;
}

// Tracking each players score and displaying to the page:
function displayScores() {
  const p1Score = document.querySelector(".player-1-score");
  p1Score.innerText = playerOne.wins;
  const p2Score = document.querySelector(".player-2-score");
  p2Score.innerText = playerTwo.wins;
}

// Checks if game has ended due to player win/lose and restarts the game:
function createPlayAgainBtn() {
  const btn = document.createElement("button"); // new
  btn.innerText = "Play Again?";
  const playAgain = document.querySelector(".play-again");

  if (!playGame && playAgain.children.length === 0) {
    playAgain.append(btn);
    // resetBoards();
  }
}

// Resets the game:
// function resetBoards() {
//   const displayWinner = document.querySelector(".display-winner");
//   const playAgain = document.querySelector(".play-again > button");
//   document.querySelector(".board").addEventListener(
//     "click",
//     (e) => {
//       if (e.target.innerText === "Play Again?") {
//         removeBoardCoords();
//         removeBoardClasses();
//         displayWinner.innerText = "";
//         setDefaultShipPos("player-1-board", playerOne);
//         setDefaultShipPos("player-2-board", playerTwo);
//         playAgain.remove();
//         playGame = true;
//       }
//     }
//     // { once: true }
//   );
// }

// restore default ship positions after win game:
function setDefaultShipPos(player) {
  player.defaultShips();
  defaultShipPos(player);
  markBoard(player);
}

// Reset game:
function removeBoardCoords() {
  const players = [playerOne, playerTwo];
  players.forEach((player) => {
    player.ships.forEach((ship) => {
      ship.coord = []; // Remove all existing coordinates.
    });
  });
}

// Remove all classes on each div for both players as game board is reset:
function removeBoardClasses() {
  const p1Board = document.querySelector(".player-1-board");
  const p2Board = document.querySelector(".player-2-board");
  const selectAllBoards = [p1Board, p2Board];

  selectAllBoards.forEach((board) => {
    board.childNodes.forEach((node) => {
      node.childNodes.forEach((childNode) => {
        childNode.classList.remove("active");
        childNode.classList.remove("missed");
        childNode.classList.remove("hit");
      });
    });
  });
}

function main() {
  setDefaultShipPos(playerOne);
  setDefaultShipPos(playerTwo);

  displayScores();
  acceptClick();
}

main();

// ? How do I place the second set of ships on the board after the 'play again?' button has been clicked on?
// ? How can the user place a specific ship on the board?
// ? How do I make the ships draggable?
// ? How do I make the ships rotate when dragged?

// ! Testing:
// Resetting the board should wipe all classes from each div and restore the original default ship placements just like starting a new game for the first time:
function resetGameBoard() {
  document.querySelector("body").addEventListener("click", (e) => {
    if (e.target.innerText === "Play Again?") {
      const numDiv = document.querySelectorAll(".num");
      numDiv.forEach((div) => {
        div.classList.remove("active", "hit", "missed");
      });
      document.querySelector(".play-again > button").remove();
      setDefaultShipPos(playerOne);
      setDefaultShipPos(playerTwo);
      console.log(playerOne);
      console.log(playerTwo);
    }
  });
}
resetGameBoard();
