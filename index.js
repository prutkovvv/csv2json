const { csv2json } = require("./csv2json/csv2jsonTransform");
const { json2csv } = require("./json2csv/json2csvTransform");
const { parseInstructions } = require("./helpers/parseIntructions");

function getArgs() {
  return process.argv.slice(2, process.argv.length).reduce(
    (acc, arg, index, arguments) => {
      if (arg.slice(0, 2) === "--") {
        return { ...acc, [arg.slice(2)]: arguments[index + 1] };
      }
      return acc;
    },
    {
      startScript:
        process.argv[2].slice(0, 2) === "--" ? "csv2json.js" : process.argv[2],
    }
  );
}

const startScriptConf = {
  "csv2json.js": csv2json,
  "json2csv.js": json2csv,
};

const { sourceFile, resultFile, separator, startScript, path } = getArgs();

try {
  if (!path) {
    startScriptConf[startScript]
      ? startScriptConf[startScript](sourceFile, resultFile, separator)
      : console.error(
          "No such file to start script: please try csv2json.js or json2csv.js"
        );
  } else {
    parseInstructions(path);
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
}
