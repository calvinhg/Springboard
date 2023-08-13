/** Command-line tool to generate Markov text. */

const process = require("process");
const { MarkovMachine } = require("./markov");

const { cat, webCat } = require("./catHelper");

const originType = process.argv[2];
const origin = process.argv[3];

if (!originType || !origin) {
  console.error(
    "Please enter two arguments:\n<file> or <url>, and the origin text"
  );
  process.exit(1);
}

if (!["file", "url"].includes(originType)) {
  console.error("Please enter a valid origin type (<file> or <url>)");
  process.exit(1);
}

async function processData() {
  let text;

  if (originType === "file") {
    text = cat(origin);
  } else {
    text = await webCat(origin);
  }

  const mm = new MarkovMachine(text);

  console.log(mm.makeText(50));
}

processData();
