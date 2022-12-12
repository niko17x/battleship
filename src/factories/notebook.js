const Ship = require("./ships");

// * Reminders:
// * Use 'map' for object in arrays /// Use 'dot notation' for just object values.

// Creating an object instance of a ship => Unable to use that instance with the GameBoard() method placeShip() since the method has no reference to the ship instance that was created => How can I add coordinates to the unique ship instance by calling on the placeShip() method?
// I need to have the placeShip() method available for access in the Ship() class.

const attack = { x: "c", y: 5 };
const ships = [
  {
    shipClass: "carrier",
    shipLength: 5,
    hitCount: 0,
    coord: [
      { x: "a", y: 1 },
      { x: "b", y: 1 },
      { x: "c", y: 1 },
      { x: "d", y: 1 },
    ],
    sunk: false,
  },
  {
    shipClass: "battle ship",
    shipLength: 4,
    hitCount: 0,
    coord: [
      { x: "a", y: 5 },
      { x: "b", y: 5 },
      { x: "c", y: 5 },
      { x: "d", y: 5 },
    ],
    sunk: false,
  },
];

// for (let i = 0; i < ships.length; i++) {
//   if (attack.x === ships[i].x && attack.y === ships[i].y) {
//     console.log("true");
//   } else {
//     console.log("false");
//   }
// }

// Todo: After finding the matching object => 'bubble up' to find the nearest 'shipClass' property => return the shipClass:
// Return the shipClass if target coord has matching ship coord:
const getHitObj = () => {
  let hitShip; // Account for the ship that was hit.
  ships.forEach((obj) => {
    // Within each ship object, check each coordinate.
    for (let i = 0; i < obj.coord.length; i++) {
      // If attack coord matches existing coord, record the coord and ship that was hit:
      if (attack.x === obj.coord[i].x && attack.y === obj.coord[i].y) {
        const hitCoord = { x: attack.x, y: attack.y };
        hitShip = obj.shipClass;
        markHit(hitShip); // ship.updateHitCount(1);
      }
    }
  });
  return hitShip; // => returns shipClass value.
};
// console.log(getHitObj());

// Find the targeted 'shipClass' and update hitCount for that ship:
const markHit = (shipClass) => {
  // Iterate through 'ships' and find the class name that matches:
  const findHitShip = ships.find((prop) => prop.shipClass === shipClass);
  return findHitShip.updateHitCount(1);
};
