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

// ??? Issue: When placing a ship that contains more than one div, dropping it on the board is causing only one div to be properly placed on the board. This is an issue b/c if the ship has more than one div, dropping the ship onto the board should take into account not only the clicked on div on the board, but also the other div's that are a part of the ship.

// ??? Idea: Submarine ship contains 2 div's due to it's length. Each div is a child that contains the class 'space'. We can have the first 'space' div append to the clicked on dropzone on the board then we can use take the second div of the ship to append it to the div below or side (horizontal placement) of it.

// Todo: Managed to get multiple div's (depending on ship length) to append to board (vertical only). However, I need to consider the out-of-bounds, re-dragging div's once placed on board, occupying space of board if ship is placed.

const ship = document.querySelector(".Submarine-2");
// const ship = document.querySelector(".Patrol-Boat-2");
// const ship = document.querySelector(".shipClass");

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

// !!! testing:

target.forEach((elem) => {
  elem.addEventListener("drop", (e) => {
    e.preventDefault();
    e.target.classList.add("dragged");

    if (e.target.classList.contains("num")) {
      dragged.parentNode.removeChild(dragged);
      // Need to get the parent/child id of 'dropped' div on board so I can get the placement of the next 'space' div according to placement of first ship 'space' div:
      e.target.appendChild(ship.children[0]);
      let pId = e.target.parentElement.id;
      let cId = e.target.id;
      // console.log(e.target.parentElement.id, e.target.id);
      console.log(elem.parentElement.id, elem.id);
      console.log(typeof pId, typeof cId);
      console.log(getNextParId(pId), getNextChildId(cId));

      target.forEach((num) => {
        if (num.parentElement.id === getNextParId(pId) && num.id === cId) {
          num.style.background = "blue";
          num.append(ship.children[0]);
        }
      });
    } else {
      // Out of bounds error message.
    }

    // if (e.target.id === "1" && e.target.parentElement.id === "A") {
    //   // append the first div 'space' of submarine to the board then remove:
    //   dragged.parentNode.removeChild(dragged); // => Removes ship from 'player 1 ships' section.
    //   e.target.appendChild(ship.children[0]);

    //   // * I need a separate function that will take in length of the ship, find the parent/child id within the board and apply each ship 'space' div to the board:
    //   const nums = document.querySelectorAll(".num");
    //   nums.forEach((num) => {
    //     if (num.parentElement.id === "B" && num.id === "1") {
    //       num.append(ship.children[0]);
    //     }
    //   });
    // }
  });
});

// Get next parent element id of given current id value:
function getNextParId(pId) {
  let result;
  const alphaDivs = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  alphaDivs.forEach((alpha, index) => {
    if (alpha === pId) {
      let alphaIndex = alphaDivs.indexOf(pId);
      result = alphaDivs[alphaIndex + 1];
    }
  });
  if (alphaDivs.includes(result)) {
    return result;
  } else {
    return "Out of bounds.";
  }
}

// Get next child element id:
function getNextChildId(cId) {
  let result;
  const numDivs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  numDivs.forEach((num) => {
    if (num === cId) {
      let alphaIndex = numDivs.indexOf(cId);
      result = numDivs[alphaIndex + 1];
    }
  });
  if (numDivs.includes(result)) {
    return result;
  } else {
    return "Out of bounds.";
  }
}

console.log(getNextChildId(9));

// If I place a ship div on the board and the length is greater than 1, I need to place the other div in proper order but need to verify if the it is out of bounds in both the parent/child id.
function dragShipOnBoard(shipLength) {
  // Account for length of ship:
  for (let i = 0; i < shipLength; i++) {}
}
