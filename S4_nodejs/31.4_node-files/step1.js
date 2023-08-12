const fs = require("fs");
const process = require("process");

const filePath = process.argv[2];

function cat(filePath) {
  if (!filePath) {
    console.log("Please enter a file path!");
    process.kill(1);
  }

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading", filePath);
      console.log(err);
      process.kill(1);
    }

    console.log(data);
  });
}

cat(filePath);
