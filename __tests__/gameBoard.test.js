const GameBoard = require("../src/factories/gameBoard");
const Ship = require("../src/factories/ships");

describe("GameBoard factory test", () => {
  let testCarrier;
  let board;

  beforeEach(() => {
    testCarrier = new Ship("Carrier", 5, 0);
    board = new GameBoard(testCarrier);
  });
  test("board.placeShip('a', 1) is to return [{ x: 'a', y: 1 }].", () => {
    expect(board.placeShip("a", 1)).toStrictEqual([{ x: "a", y: 1 }]);
  });
  test("board.placeShip('zz', 99) is to return false.", () => {
    expect(board.placeShip("zz", 99)).toBe(false);
  });
});
