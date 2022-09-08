const fs = require("fs");

function getArgs() {
  const args = {};
  process.argv
    .slice(2, process.argv.length)
    .forEach((arg, index, arguments) => {
      if (arg.slice(0, 2) === "--") {
        args[arg.slice(2)] = arguments[index + 1];
      }
    });
  return args;
}
const args = getArgs();

const jsonArr = [];
if (args.sourceFile && args.resultFile) {
  fs.readFile(args.sourceFile, { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.log(`Err while reading data ${err}`);
    }
    const dataRows = data.split("\r");
    const fields = dataRows[0].split(",");
    console.log({ fields });

    dataRows.slice(1).forEach((dataRow) => {
      const itemsArr = dataRow.split(",");
      const rowObj = fields.reduce((acc, field, index) => {
        return { ...acc, [field]: itemsArr[index] };
      }, {});
      jsonArr.push(rowObj);
    });

    fs.writeFile(
      args.resultFile,
      JSON.stringify(jsonArr, null, "  "),
      (err) => {
        if (err) {
          console.log(`Err while writing data ${err}`);
        }
        console.log("Ready");
      }
    );
  });
}
