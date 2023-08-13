/** Remove all punctuation from text (except dashes)*/
function removePunct(text) {
  const punctRegex = /[!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~]/g;

  return text.replace(punctRegex, "");
}

/** Textual markov chain generator */
class MarkovMachine {
  /** build markov machine; read in text.*/
  constructor(text) {
    // Remove punctuation
    // text = removePunct(text);
    // Split text into words
    let words = text.split(/[ \r\n]+/);
    // Remove empty strings
    this.words = words.filter((c) => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */
  makeChains() {
    const chains = {};
    for (let i = 0; i < this.words.length; i++) {
      const word = this.words[i];
      let nextWord = this.words[i + 1];

      if (!chains[word]) chains[word] = [];
      if (nextWord === undefined) nextWord = null;
      chains[word].push(nextWord);
    }
    this.chains = chains;
  }

  /** return random text from chains */
  makeText(numWords = 100) {
    // Create var and add first word
    const randIdx = Math.floor(Math.random() * this.words.length);
    const text = [this.words[randIdx]];

    for (let i = 1; i < numWords; i++) {
      // Get options from previous word
      const options = this.chains[text[i - 1]];
      // Get random index from the options
      const randIdx = Math.floor(Math.random() * options.length);
      // Check the selected option isn't null, and add it to text
      if (options[randIdx]) text[i] = options[randIdx];
      else break;
    }
    // Convert to string and return it
    return text.join(" ");
  }
}

module.exports = { MarkovMachine };
