const fs = require("fs");

const { exec, execSync } = require("child_process");

const parseInstructions = (path) => {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) throw err;
    if (data) {
      const instructions = data.split("\r\n");
      instructions.forEach((instr) => {
        console.log(`${instr} -------------- started`);
        execSync(instr);
        console.log(`${instr} -------------- finished`);
      });
    }
  });
};

module.exports = {
  parseInstructions,
};
