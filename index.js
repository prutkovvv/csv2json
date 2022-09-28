const { processInstructions } = require("./helpers/parseIntructions");
const { getArgs } = require("./helpers/getArgs");
const { START_SCRIPT_CONFIGURATION } = require("./constants/index");

const { sourceFile, resultFile, separator, startScript, filePath } = getArgs();
try {
  if (!filePath) {
    START_SCRIPT_CONFIGURATION[startScript]
      ? START_SCRIPT_CONFIGURATION[startScript](
          sourceFile,
          resultFile,
          separator
        )
      : console.error(
          "No such file to start script: please try csv2json.js or json2csv.js"
        );
  } else {
    processInstructions(filePath);
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
}
