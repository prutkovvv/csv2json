const { Transform } = require("stream");
const fs = require("fs");

const csv2jsonTransform = (sourceFile, resultFile, separator = ",") => {
  const rs = fs.createReadStream(sourceFile, { encoding: "utf-8" });
  const ws = fs.createWriteStream(resultFile, {
    encoding: "utf-8",
  });
  console.log({ separator });
  const createTransformStream = () => {
    let firstChunk = true;
    let fields = [];
    let temp;
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

        const dataArr = dataRows
          .slice(1, dataRows.length - 1)
          .map((dataRow) => {
            const itemsArr = dataRow.split(separator);
            const rowObj = fields.reduce((acc, field, index) => {
              return { ...acc, [field]: itemsArr[index] };
            }, {});
            return rowObj;
          });

        temp = dataRows.slice(dataRows.length - 1);

        this.push(
          `${firstChunk ? "" : ","}${JSON.stringify(dataArr, null, 2).replace(
            /]|[[]/g,
            ""
          )}`
        );
        if (firstChunk) firstChunk = false;
        cb();
      },

      flush(callback) {
        this.push("]");
        callback();
      },
    });
  };

  const transform = createTransformStream();

  rs.pipe(transform).pipe(ws);
};

module.exports = {
  csv2json: csv2jsonTransform,
};
