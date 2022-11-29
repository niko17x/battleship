const isSunk = require("../main");

test("When ship length is equal to hit count, expected to return true, otherwise false.", () => {
  expect(isSunk(4, 4, false)).toBe(true);
});
