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

// Player 1 => place a coordinate to attack.
// Player 2 turn.
// Player 2 => place a coordinate to attack.
// Player 1 turn.
