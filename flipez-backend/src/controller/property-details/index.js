const asyncMiddleware = require('../../lib/async-middleware');

module.exports = {
  edit: asyncMiddleware(require('./edit')),
  create: asyncMiddleware(require('./create')),
  getMyPropertyDetails: asyncMiddleware(require('./get-my-property-details')),
  getAddressPrice: asyncMiddleware(require('./get-address-price')),
};
