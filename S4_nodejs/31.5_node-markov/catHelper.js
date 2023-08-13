const fs = require("fs");
const process = require("process"); //REMOVE
const axios = require("axios");

function cat(filePath) {
  try {
    // Read file and return its contents
    const data = fs.readFileSync(filePath, "utf-8");
    return data;
  } catch (err) {
    // Show error and exit
    console.error("Error reading", filePath);
    console.error(err.message);
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

module.exports = { cat, webCat };
