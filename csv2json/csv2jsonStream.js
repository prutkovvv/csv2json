const fs = require("fs");

const csv2jsonStream = (sourceFile, resultFile, separator = ",") => {
  const rs = fs.createReadStream(sourceFile, { encoding: "utf-8" });
  const ws = fs.createWriteStream(resultFile, { encoding: "utf-8" });

  rs.on("data", (chunk) => {
    const dataRows = chunk.split("\r\n");
    if (firstChunk) {
      fields = dataRows[0].split(separator);
    }

    if (firstChunk) {
      ws.write("[");
    }

    if (temp && !firstChunk) {
      temp += dataRows[0];
    }

    dataRows.slice(1, dataRows.length - 1).forEach((dataRow) => {
      const itemsArr = dataRow.split(separator);
      const rowObj = fields.reduce((acc, field, index) => {
        return { ...acc, [field]: itemsArr[index] };
      }, {});
      ws.write(`${JSON.stringify(rowObj, null, 2)},`);
    });

    // const dataArr = dataRows.slice(1, dataRows.length - 1).map((dataRow) => {
    //   const itemsArr = dataRow.split(separator);
    //   const rowObj = fields.reduce((acc, field, index) => {
    //     return { ...acc, [field]: itemsArr[index] };
    //   }, {});
    //   return rowObj;
    // });
    // ws.write(`${JSON.stringify([...dataArr], null, 2)},`);

    temp = dataRows.slice(dataRows.length - 1);

    if (firstChunk) firstChunk = false;
  });

  rs.on("end", () => {
    ws.write("]");
  });
};

module.exports = {
  csv2json: csv2jsonStream,
};
