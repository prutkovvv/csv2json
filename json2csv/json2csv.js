const { Transform } = require("stream");
const fs = require("fs");
const { getArgs } = require("../helpers/getArgs");

const json2csvStream = (sourceFile, resultFile, separator = ",") => {
  return new Promise((resolve, reject) => {
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
          firstChunk = false;
          this.push(result);
          cb();
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
    const res = await json2csvStream(sourceFile, resultFile, separator);
    process.send(`Command finished: ${msg}`);
    process.exit();
  } catch (e) {
    process.send(e.message);
    process.exit();
  }
});

module.exports = {
  json2csv: json2csvStream,
};
