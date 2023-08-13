const { MarkovMachine } = require("./markov");

describe("Markov Machine class", () => {
  let mm;
  beforeEach(() => {
    mm = new MarkovMachine("the cat in the hat is in the hat");
  });

  test("splits all the words into an array", () => {
    expect(mm.words).toEqual([
      "the",
      "cat",
      "in",
      "the",
      "hat",
      "is",
      "in",
      "the",
      "hat",
    ]);
  });

  test("makes chains from the array", () => {
    expect(mm.chains).toEqual({
      the: ["cat", "hat", "hat"],
      cat: ["in"],
      in: ["the", "the"],
      hat: ["is", null],
      is: ["in"],
    });
  });

  test("makeText returns markov text", () => {
    expect(mm.makeText()).toContain("the" || "cat" || "in" || "hat" || "is");
    // Regex is for a sentence with up to 9 spaces (10 words)
    expect(mm.makeText(10)).toMatch(/^([^ ]* ){0,9}[^ ]*$/);
  });
});
