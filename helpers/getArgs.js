function getStartScript(configParam) {
  return configParam.slice(0, 2) === "--" ? "csv2json.js" : configParam;
}

function getArgs(paramString) {
  const findParamsArr = paramString
    ? paramString.replaceAll('"', "").split(" ")
    : process.argv.slice(2, process.argv.length);
  return findParamsArr.reduce(
    (acc, arg, index, arguments) => {
      if (arg.slice(0, 2) === "--") {
        return { ...acc, [arg.slice(2)]: arguments[index + 1] };
      }
      return acc;
    },
    {
      startScript: paramString ? undefined : getStartScript(process.argv[2]),
    }
  );
}

module.exports = {
  getArgs,
};
