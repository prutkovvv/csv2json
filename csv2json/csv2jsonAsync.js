const fs = require("fs");

const csv2jsonAsync = (sourceFile, resultFile, separator = ",") => {
  console.log({ sourceFile, resultFile });
  if (sourceFile && resultFile) {
    fs.readFile(sourceFile, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        console.log(`Err while reading data ${err}`);
      }
      const dataRows = data.split("\r");
      console.log("length", dataRows.length);
      const fields = dataRows[0].split(separator);
      console.log({ fields });

      const jsonArr = dataRows.slice(1).map((dataRow) => {
        const itemsArr = dataRow.split(separator);
        const rowObj = fields.reduce((acc, field, index) => {
          return { ...acc, [field]: itemsArr[index] };
        }, {});
        return rowObj;
      });

      fs.writeFile(resultFile, JSON.stringify(jsonArr, null, 2), (err) => {
        if (err) {
          console.log(`Err while writing data ${err}`);
        }
        console.log("Ready");
      });
    });
  }
};

module.exports = {
  csv2json: csv2jsonAsync,
};
