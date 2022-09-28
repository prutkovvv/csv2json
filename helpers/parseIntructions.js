const fs = require("fs");
const readLine = require("readline");
const { fork } = require("child_process");
const path = require("path");

const processInstructions = (filePath) => {
  const readFileStream = fs.createReadStream(filePath);
  const rl = readLine.createInterface({ input: readFileStream });

  rl.on("line", (input) => {
    const fileName = input.split(" ")[0];
    if (fileName) {
      const proc = fork(
        `${path.join(__dirname, "..", fileName.split(".")[0])}/${fileName}`
      );
      proc.on("message", (response) => {
        console.log(response);
      });
      proc.send(input);
    }
  });
};

module.exports = {
  processInstructions,
};
