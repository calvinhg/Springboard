const fs = require("fs");
const process = require("process");
const axios = require("axios");

function cat(filePath) {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading", filePath);
      console.log(err.message);
      process.exit(1);
    }

    console.log(data);
  });
}

async function webCat(link) {
  try {
    const resp = await axios.get(link);
    console.log(resp.data);
  } catch (error) {
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
  console.error("Please enter argument!");
  process.exit(1);
}

if (arg.startsWith("http")) webCat(arg);
else cat(arg);
