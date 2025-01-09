const fs = require("fs");
const getState = (req) => {
  const rawData = fs.readFileSync(__dirname + "/../../json/states.json");
  const states = JSON.parse(rawData);
  return req.sendResponse(
    200,
    states.filter((state) => state.country_code == "US")
  );
};

module.exports = getState;
