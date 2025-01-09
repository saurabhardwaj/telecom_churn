const asyncMiddleware = require('../../lib/async-middleware');

module.exports = {
  create: asyncMiddleware(require('./create')),
  uploadFile: asyncMiddleware(require('./uploadFile')),
  downloadFile: asyncMiddleware(require('./downloadFile')),
};
