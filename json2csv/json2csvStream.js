const { Transform } = require("stream");
const fs = require("fs");

const json2csvStream = (sourceFile, resultFile, separator) => {
  const rs = fs.createReadStream(sourceFile, { encoding: "utf-8" });
  const ws = fs.createWriteStream(resultFile, {
    encoding: "utf-8",
  });

  const createTransformStream = () => {
    return new Transform({
      construct(callback) {
        // this.push("[");
        callback();
      },

      transform(chunk, enc, cb) {
        console.log(chunk.toString());
      },
    });
  };

  const transform = createTransformStream();

  rs.pipe(transform).pipe(ws);
};

module.exports = {
  json2csv: json2csvStream,
};
