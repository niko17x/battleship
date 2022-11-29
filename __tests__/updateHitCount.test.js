const updateHitCount = require("../main");

test("Hit count (1) + 1 is expected to be 2.", () => {
  expect(updateHitCount(1)).toBe(2);
});
