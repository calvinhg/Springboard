const fs = require("fs");
const process = require("process");
const axios = require("axios");

function cat(filePath) {
  try {
    // Read file and return its contents
    const data = fs.readFileSync(filePath, "utf-8");
    return data;
  } catch (err) {
    // Show error and exit
    console.error("Error reading", filePath);
    console.error(err);
    process.exit(1);
  }
}

async function webCat(link) {
  try {
    // Get website html from axios and return it
    const resp = await axios.get(link);
    return resp.data;
  } catch (error) {
    // Show error and exit
    if (error.code === "ECONNRESET") {
      console.error("Error: The server closed the connection unexpectedly");
    } else if (error.code === "ECONNREFUSED") {
      console.error("Error: Please be sure to use https");
    } else if (error.code === "ERR_FR_TOO_MANY_REDIRECTS") {
      console.error("Error: Too many redirects");
    } else if (error.code === "ENOTFOUND") {
      console.error("Error: Request failed with status code 404");
    } else {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

const arg = process.argv[2];
if (!arg) {
  // Exit if no argument entered
  console.error("Please enter an argument!");
  process.exit(1);
}

if (arg === "--out") {
  // Get input and output files
  const output = process.argv[3];
  const input = process.argv[4];

  // Exit if either are missing
  if (!output || !input) {
    console.error("Please enter an output and an input file");
    process.exit(1);
  }

  // Write to new file contents of input file
  fs.writeFile(output, cat(input), "utf-8", (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
} else if (arg.startsWith("http"))
  webCat(arg).then((data) => console.log(data));
else console.log(cat(arg));
