const generateBigFile = (sourcePath) => {
  fs.readFile(sourcePath, { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.error(`Err while reading file ${err}`);
    }
    fs.writeFile("./assets/test_big.csv", data, (err) => {
      if (err) {
        console.error(`Err while writing data ${err}`);
      }
    });
    const modifiedData = data.split("\r").slice(1).join("\r");
    for (let i = 0; i < 20000; i++) {
      fs.appendFile("./assets/test_big.csv", modifiedData, (err) => {
        if (err) {
          console.error(`Err while writing data ${err}`);
        }
      });
    }
  });
};

module.exports = {
  generateBigFile,
};
