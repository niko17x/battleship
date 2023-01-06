// import _ from "lodash";
// import { create } from "/lodash.js";
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
  let playerBoard;
  player === playerOne
    ? (playerBoard = document.querySelector(".player-1-ships"))
    : (playerBoard = document.querySelector(".player-2-ships"));

  player.ships.forEach((ship) => {
    const shipClassDiv = document.createElement("div");
    for (let i = 0; i < ship.shipLength; i++) {
      const div = document.createElement("div");
      div.classList.add("space");
      shipClassDiv.classList.add(ship.shipClass, "draggable");
      // shipClassDiv.setAttribute("id", "draggable");
      shipClassDiv.setAttribute("draggable", true);
      shipClassDiv.append(div);
    }
    playerBoard.append(shipClassDiv);
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

function main() {
  setGameDefaults(playerOne);
  setGameDefaults(playerTwo);
  displayShips(playerOne);
  displayShips(playerTwo);

  acceptClick();
  displayScores();
  resetGameBoard();
}

main();

// !!! DRAG FUNCTIONS/EVENTS !!! //

// ? Issues => Dragging a single div to board seems to work however, trying to place a ship with multiple div's somehow forces the div's that are placed horizontal, in vertical position only. /// Border or background color being applied to the ship div's are not exactly in line causing 'spillage'.
foo();

// const ship = document.querySelector(".Carrier");
// const ship = document.querySelector(".Patrol-Boat-2");
const ship = document.querySelector(".shipClass");

let dragged;
ship.addEventListener("dragstart", (e) => {
  dragged = e.target;
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
    e.target.classList.add("dragged");

    if (e.target.classList.contains("num")) {
      dragged.parentNode.removeChild(dragged);
      e.target.appendChild(dragged);

      const x = e.target.offsetWidth / 2 - ship.offsetWidth / 2;
      const y = e.target.offsetHeight / 2 - ship.offsetHeight / 2;

      e.target.firstChild.setAttribute(
        "style",
        `position: relative; left: ${x}px; top: ${y}px;`
      );
    }
  });
});

// Todo: Figure out how to make each ship space div an exact size instead of spilling over => How can I get these div spaces to show up horizontally on page w/o having to use inline-block (which is causing the spillage)?
function foo() {
  const divs = [];
  const p1Ships = document.querySelector(".player-1-ships");

  for (let i = 0; i < 1; i++) {
    const parentDiv = document.createElement("div");
    parentDiv.classList.add("shipClass");
    parentDiv.classList.add("draggable");

    const childDiv = document.createElement("div");
    childDiv.classList.add("noSpace");
    parentDiv.setAttribute("draggable", true);

    parentDiv.append(childDiv);
    p1Ships.append(parentDiv);

    divs.push(childDiv);
  }
}

// Chnage the style of the draggable div with : style="position: relative; left: 8px; top: 8px;"
