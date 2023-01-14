// import _ from "lodash";
// import { create } from "/lodash.js";
// import { indexOf } from "lodash";
import { GameBoard } from "./factories/gameBoard.js";
import { Player } from "./factories/player.js";
import { Ship } from "./factories/ships.js";

const printWindow = () => {
  window.addEventListener("click", (e) => {
    // console.log(e.target.parentNode.id, e.target.id);
    // console.log(playGame);
    console.log(e.target.offsetWidth);
    console.log(e.target.offsetHeight);
  });
};
// printWindow();

let playGame = true;
// let playGame = false;

let shipOrientation = "vertical";
shipOrientation = "horizontal";
// shipOrientPlacement();

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

function main() {
  setGameDefaults(playerOne);
  setGameDefaults(playerTwo);
  createShips();

  acceptClick();
  displayScores();
  resetGameBoard();
}

main();

function togglePlayerTurn() {
  if (playerOneTurn) {
    playerOneTurn = false;
  } else {
    playerOneTurn = true;
  }
}

// Takes players ships and displays on page as 'div spaces' based on ship length to indicate the available ships:
function createShips(orientation) {
  const player1Ships = document.querySelector(".player-1-ships");
  const player2Ships = document.querySelector(".player-2-ships");
  const players = [playerOne, playerTwo];

  players.forEach((player) => {
    player.ships.forEach((ship) => {
      const shipClassDiv = document.createElement("div");

      for (let i = 0; i < ship.shipLength; i++) {
        if (shipOrientation === "horizontal") {
          const div = document.createElement("div");
          div.classList.remove("vertical");
          div.classList.add("space", "horizontal");
          shipClassDiv.classList.add(ship.shipClass.toLowerCase(), "draggable");
          shipClassDiv.setAttribute("draggable", true);
          shipClassDiv.append(div);
        } else {
          const div = document.createElement("div");
          div.classList.remove("horizontal");
          div.classList.add("space", "vertical");
          player1Ships.style.display = "grid";
          player1Ships.style.setProperty(
            "grid-template-columns",
            "repeat(7, 1fr)"
          );
          player2Ships.style.display = "grid";
          player2Ships.style.setProperty(
            "grid-template-columns",
            "repeat(7, 1fr)"
          );
          shipClassDiv.classList.add(ship.shipClass.toLowerCase(), "draggable");
          shipClassDiv.setAttribute("draggable", true);
          shipClassDiv.append(div);
        }
      }
      if (player === playerOne) {
        player1Ships.append(shipClassDiv);
      } else {
        player2Ships.append(shipClassDiv);
      }
    });
  });
}

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
  // setShipCoord(player, "Patrol-Boat-2", "E", 3);
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
  getWinner(player);
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

// Gets new filtered list of ships that have NOT been sunk:
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

function getWinner(player) {
  let winner;
  player === playerOne ? (winner = playerOne) : (winner = playerTwo);

  if (allShipsSunk(winner)) {
    winner.addWin();
    displayWinner(winner);
    playGame = false;
  }
}

// Takes data from 'recSunkShips()' and uses DOM to add winner to display onto page:
function displayWinner(winner) {
  let player;
  winner === playerOne ? (player = "Player One") : (player = "Player Two");
  const dispWin = document.querySelector(".display-winner");
  dispWin.innerText = `${player} wins!`;
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

// restore default ship positions after win game:
function setGameDefaults(player) {
  player.defaultShips();
  defaultShipPos(player);
  markBoard(player);
  // playerOneTurn = true;
}

// Removing previous ships (to be used after game is over and restarted):
function utilRemovePrevShips() {
  const players = [playerOne, playerTwo];
  players.forEach((player) => {
    player.ships.length = 0;
  });
}

function utilGetPlayer(player) {
  let result;
  player === playerOne ? (result = "Player One") : (result = "Player Two");
}

// Resetting the board should wipe all classes from each div and restore the original default ship placements just like starting a new game for the first time:
function resetGameBoard() {
  document.querySelector("body").addEventListener("click", (e) => {
    if (e.target.innerText === "Play Again?") {
      // Remove all existing classes in all div's:
      const numDiv = document.querySelectorAll(".num");
      numDiv.forEach((div) => {
        div.classList.remove("active", "hit", "missed");
      });
      // Remove 'play-again' button:
      utilRemovePlayAgainBtn();
      // Remove display showing winner:
      utilRemoveWinnerDisplay();
      // Remove all existing ships for both players:
      utilRemovePrevShips();
      // Put game in "on" mode again:
      playGame = true;
      // Replay from beginning:
      main();
    }
  });
}

// Removing winner display after round is over:
function utilRemoveWinnerDisplay() {
  const displayWinner = document.querySelector(".display-winner");
  if (displayWinner.innerText !== "" || displayWinner.innerText !== null) {
    displayWinner.innerText = "";
  }
}

// Removing play-again button:
function utilRemovePlayAgainBtn() {
  const parentDiv = document.querySelector(".play-again");
  const btn = document.querySelector(".play-again > button");
  if (parentDiv.contains(btn)) {
    btn.remove();
  }
}

// !!! DRAG FUNCTIONS/EVENTS !!! //

const shipCarrier = document.querySelector(".carrier");
const shipBattle = document.querySelector(".battle-ship");
const shipDest = document.querySelector(".destroyer");
const shipSub1 = document.querySelector(".submarine-1");
const shipSub2 = document.querySelector(".submarine-2");
const shipPatrol1 = document.querySelector(".patrol-boat-1");
const shipPatrol2 = document.querySelector(".patrol-boat-2");

const selectAllShips = [
  shipCarrier,
  shipBattle,
  shipDest,
  shipSub1,
  shipSub2,
  shipPatrol1,
  shipPatrol2,
];

let dragged;

selectAllShips.forEach((ship) => {
  ship.addEventListener("dragstart", (e) => {
    dragged = e.target;
  });
});

const target = document.querySelectorAll(".num");

target.forEach((elem) => {
  elem.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
});

target.forEach((elem) => {
  elem.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("num")) {
      let pId = e.target.parentElement.id;
      let cId = e.target.id;
      if (shipOrientation === "vertical") {
        const getParElements = getNextParId(pId, dragged.children.length);
        if (getParElements) {
          target.forEach((num) => {
            for (let i = 0; i < getParElements.length; i++) {
              if (
                num.parentElement.id === getParElements[i] &&
                num.id === cId
              ) {
                num.classList.add("active");
                num.append(dragged.children[0]);
              }
            }
          });
          dragged.parentNode.removeChild(dragged);
        }
      } else {
        const getChildElements = getNextChildId(cId, dragged.children.length);
        if (getChildElements) {
          target.forEach((num) => {
            for (let i = 0; i < getChildElements.length; i++) {
              if (
                num.parentElement.id === pId &&
                num.id === getChildElements[i]
              ) {
                num.classList.add("active");
                num.append(dragged.children[0]);
              }
            }
          });
          dragged.parentNode.removeChild(dragged);
        }
      }
    }
  });
});

// *** Not currently being used *** //
function shipOrientPlacement() {
  const spaces = document.querySelectorAll(".space");
  console.log(shipOrientation);
  if (shipOrientation === "horizontal") {
    spaces.forEach((space) => {
      space.classList.add("horizontal");
    });
  } else {
    spaces.forEach((space) => {
      space.classList.add("vertical");
    });
    const p1Ships = document.querySelector(".player-1-ships");
    const p2Ships = document.querySelector(".player-2-ships");
    p1Ships.style.display = "grid";
    p1Ships.style.setProperty("grid-template-columns", "repeat(7, 1fr)");
    p2Ships.style.display = "";
    p2Ships.style.setProperty("grid-template-columns", "repeat(7, 1fr)");
  }
}

// Go through each div on board and 'find' the parent id for each item in the array for getNextParId() => Then append each ship 'space' div to the div on the board that matches. => The function should accept a single input (items from the array):
function findBoardDiv(alphaDiv) {
  const boardDivs = document.querySelectorAll(".num");
  // let findDiv = boardDivs.find((div) => div.parentElement.id === alphaDiv);
  boardDivs.forEach((div) => {
    if (div.parentElement.id === alphaDiv) {
      return div;
    }
  });
}

// Get next parent element id of given current id value:
function getNextParId(pId, length) {
  let result = [];
  const alphas = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  for (let i = 0; i < length; i++) {
    if (alphas.includes(pId)) {
      let alphaIndex = alphas.indexOf(pId);
      result += pId;
      pId = alphas[alphaIndex + 1];
    } else {
      return false;
    }
  }
  return result;
}

// Get next child element id:
function getNextChildId(cId, length) {
  let result = [];
  const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  for (let i = 0; i < length; i++) {
    if (nums.includes(cId)) {
      let alphaIndex = nums.indexOf(cId);
      result += cId;
      cId = nums[alphaIndex + 1];
    } else {
      return false;
    }
  }
  return result;
}

// !!! WORKING ON THIS FUNCTION:
function toggleShipOrient() {
  const btn = document.querySelector(".ship-orient-btn");
  btn.addEventListener("click", (e) => {
    if (shipOrientation === "vertical") {
      shipOrientation = "horizontal";
    } else {
      shipOrientation = "vertical";
    }
    utilChangeOrient(shipOrientation);
  });
}
toggleShipOrient();

function utilChangeOrient(shipOrientation) {
  const p1 = document.querySelector(".player-1-ships").children;
  const p1Ships = document.querySelector(".player-1-ships");
  const p2Ships = document.querySelector(".player-2-ships");
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p1[i].children.length; j++) {
      if (shipOrientation === "horizontal") {
        p1[i].children[j].classList.remove("vertical");
        p1[i].children[j].classList.add("horizontal");
        p1Ships.style.display = "";
        p2Ships.style.display = "";
      } else {
        p1[i].children[j].classList.remove("horizontal");
        p1[i].children[j].classList.add("vertical");
        p1Ships.style.display = "grid";
        p2Ships.style.display = "grid";
      }
    }
  }
}

// ??? Placing a ship for player 2 is causing a bug.
