const { Transform } = require("stream");
const fs = require("fs");
const { getArgs } = require("../helpers/getArgs");

const csv2jsonStream = (sourceFile, resultFile, separator = ",") => {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(sourceFile, { encoding: "utf-8" });
    const ws = fs.createWriteStream(resultFile, {
      encoding: "utf-8",
    });
    const createTransformStream = () => {
      let firstChunk = true;
      let fields = [];
      let temp;

      const processDataRow = (dataRow) => {
        const itemsArr = dataRow.split(separator);
        const rowObj = fields.reduce((acc, field, index) => {
          return { ...acc, [field]: itemsArr[index] };
        }, {});
        return rowObj;
      };

      return new Transform({
        construct(callback) {
          this.push("[");
          callback();
        },

        transform(chunk, enc, cb) {
          const dataRows = chunk.toString().split("\r\n");
          if (firstChunk) {
            fields = dataRows[0].split(separator);
          }

          if (temp && !firstChunk) {
            temp += dataRows[0];
          }
          const gluedItems = temp
            ? [temp, ...dataRows.slice(1, dataRows.length - 1)]
            : dataRows.slice(1, dataRows.length - 1);

          const dataArr = gluedItems.map(processDataRow);

          temp = dataRows[dataRows.length - 1];

          this.push(
            `${firstChunk ? "" : ","}${JSON.stringify(dataArr).replace(
              /]|[[]/g,
              ""
            )}`
          );
          if (firstChunk) firstChunk = false;
          cb();
        },

        flush(callback) {
          this.push(`,${JSON.stringify(processDataRow(temp))}]`);
          callback();
        },
      });
    };

    const transform = createTransformStream();

    rs.pipe(transform)
      .pipe(ws)
      .on("finish", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

process.on("message", async (msg) => {
  try {
    process.send(`Command started: ${msg}`);
    const { sourceFile, resultFile, separator } = getArgs(msg);
    const res = await csv2jsonStream(sourceFile, resultFile, separator);
    process.send(`Command finished: ${msg}`);
    process.exit();
  } catch (e) {
    process.send(e.message);
    process.exit();
  }
});

module.exports = {
  csv2json: csv2jsonStream,
};
