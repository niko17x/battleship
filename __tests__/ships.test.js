import Ships from "../src/factories/ships";

describe("Testing ship factory", () => {
  let exampleCarrier;
  let sunkCarrier;
  beforeEach(() => {
    exampleCarrier = new Ships("Carrier", 5, 0);
    sunkCarrier = new Ships("Carrier", 5, 0);
  });

  test("1 + updateCount(1) returns sum of 2", () => {
    exampleCarrier.updateHitCount(1);
    expect(exampleCarrier.hitCount).toEqual(1);
  });

  test("Ship length >= hitCount, expect .isSunk() to be true", () => {
    sunkCarrier.updateHitCount(5);
    expect(sunkCarrier.isSunk()).toBe(true);
  });
});
