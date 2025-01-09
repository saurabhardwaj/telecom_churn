const asyncMiddleware = require('../../lib/async-middleware');

module.exports = {
  get: asyncMiddleware(require('./get')),
  getAll: asyncMiddleware(require('./getAll')),
  edit: asyncMiddleware(require('./edit')),
  clearSession: asyncMiddleware(require('./clear-session')),
};
