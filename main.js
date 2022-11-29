const ship = (length, hitCount, sunk) => ({
  length,
  hitCount,
  sunk,
});

// Function to update hit count of ship:
const updateHitCount = (hitCount) => {
  const newHitCount = hitCount + 1;
  return newHitCount;
};

// Function to calculate if 'sunk' based on length of ship and hit count:
const isSunk = (shipLength, hitCount, sunk) => {
  let shipIsSunk = sunk;

  if (shipLength < hitCount) {
    return "Hit count can not be greater than ships length.";
  }

  if (shipLength === hitCount) {
    shipIsSunk = true;
  } else {
    shipIsSunk = false;
  }
  return shipIsSunk;
};

module.exports = updateHitCount;
module.exports = isSunk;
