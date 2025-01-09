const asyncMiddleware = require("../../lib/async-middleware");

module.exports = {
  getCity: asyncMiddleware(require("./getCity")),
  getState: asyncMiddleware(require("./getState")),
  getAddress: asyncMiddleware(require("./getAddress")),
};
