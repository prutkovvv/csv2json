const { Transform } = require("stream");
const fs = require("fs");

const json2csvStream = (sourceFile, resultFile, separator = ",") => {
  const rs = fs.createReadStream(sourceFile, { encoding: "utf-8" });
  const ws = fs.createWriteStream(resultFile, {
    encoding: "utf-8",
  });

  const createTransformStream = () => {
    let firstChunk = true;
    let temp = "";
    let i = 0;
    return new Transform({
      construct(callback) {
        callback();
      },

      transform(chunk, enc, cb) {
        i++;

        const chunkInProgress = firstChunk
          ? chunk.toString().slice(1)
          : `${temp}${chunk.toString()}`;

        const splitted = chunkInProgress
          .split(/[{}]/)
          .filter((i) => !(i === "," || !Boolean(i)))
          .map((str, i, arr) => {
            return i + 1 !== arr.length ? JSON.parse(`{${str}}`) : str;
          });
        const firstLine = firstChunk
          ? Object.keys(splitted[0]).join(separator)
          : "";

        const result = splitted.slice(0, splitted.length - 1).reduce(
          (acc, dataObject) => {
            return `${acc}\r\n${Object.values(dataObject).join(separator)}`;
          },
          firstChunk ? firstLine : ""
        );
        temp = splitted[splitted.length - 1];
        console.log({ temp });
        firstChunk = false;
        this.push(result);
        cb();
      },
    });
  };

  const transform = createTransformStream();

  rs.pipe(transform).pipe(ws);
};

module.exports = {
  json2csv: json2csvStream,
};
