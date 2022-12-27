const Ship = require("./ships");
const Player = require("./player");

// * Reminders:
// * Use 'map' for object in arrays /// Use 'dot notation' for just object values.

// Creating an object instance of a ship => Unable to use that instance with the GameBoard() method placeShip() since the method has no reference to the ship instance that was created => How can I add coordinates to the unique ship instance by calling on the placeShip() method?
// I need to have the placeShip() method available for access in the Ship() class.

const attack = { x: "c", y: 5 };

const ships = [
  {
    shipClass: "Battle Ship",
    shipLength: 4,
    hitCount: 4,
    coord: [Array],
    sunk: true,
  },
  {
    shipClass: "Carrier",
    shipLength: 5,
    hitCount: 5,
    coord: [Array],
    sunk: true,
  },
];

// Functions that are not being used but saved (just in case):
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
// placeShipOnBoard(playerOne);
// placeShipOnBoard(playerTwo);

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

// Takes coords from getAttackCoord() function and checks if a ship is currently occupying the div coords:
const isAttackCoordValid = (x, y) => {
  playerOne.ships.forEach((ship) => {
    ship.coord.forEach((coordinate) => {
      // console.log(coordinate.x, coordinate.y);
      if (coordinate.x === x && coordinate.y === y) {
        console.log(coordinate);
        return true; // Given coord is a hit.
      }
    });
  });
};
