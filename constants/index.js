const { csv2json } = require("../csv2json/csv2json");
const { json2csv } = require("../json2csv/json2csv");

const START_SCRIPT_CONFIGURATION = {
  "csv2json.js": csv2json,
  "json2csv.js": json2csv,
};
module.exports = {
  START_SCRIPT_CONFIGURATION,
};
