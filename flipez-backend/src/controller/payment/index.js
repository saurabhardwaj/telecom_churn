const asyncMiddleware = require('../../lib/async-middleware');

module.exports = {
    getCheckoutSession: asyncMiddleware(require('./get-checkout-session')),
};
