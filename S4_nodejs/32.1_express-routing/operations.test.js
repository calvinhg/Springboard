const { describe } = require("node:test");
const { mean, median, mode } = require("simple-statistics");
const { ExpressError, getArrFromQuery } = require("./helpers");

describe("operation tests", () => {
  test("mean tests >:D", () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
    expect(mean([0, 6, 2, -2, 4])).toBe(2);
    expect(mean([1.5, 2.5, 3.5, 4.6])).toBe(3.025);
  });

  test("median tests >.>", () => {
    expect(median([7, 3, 9, 5, 1])).toBe(5);
    expect(median([2, 8, 4, 6])).toBe(5);
    expect(median([1, 2, 3, 2, 4])).toBe(2);
  });

  test("mode test 8D", () => {
    expect(mode([1, 2, 3, 4, 2])).toBe(2);
  });
});

describe("helper tests", () => {
  test("ExpressError class", () => {
    const err = new ExpressError("Payment required", 402);
    expect(err.message).toBe("Payment required");
    expect(err.status).toBe(402);
  });

  test("get array from query", () => {
    const query1 = "1,4,6,2";
    expect(getArrFromQuery(query1)).toEqual([1, 4, 6, 2]);

    const query2 = "1,4,e6,2";
    expect(() => getArrFromQuery(query2)).toThrow(ExpressError);
    expect(() => getArrFromQuery(query2)).toThrow("e6 is not a number");
  });
});
