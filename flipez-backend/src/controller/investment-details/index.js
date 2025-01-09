const asyncMiddleware = require('../../lib/async-middleware');

module.exports = {
  edit: asyncMiddleware(require('./edit')),
  create: asyncMiddleware(require('./create')),
  getMyInvestmentDetails: asyncMiddleware(require('./get-my-investment-details')),
  getInitialInvestmentOpportunity: asyncMiddleware(require('./get-initial-investment-opportunity')),
  getMarketComparison: asyncMiddleware(require('./market-comparison')),
  getNeighborhoodDetails: asyncMiddleware(require('./neighborhood-details')),
  updateRehabValue: asyncMiddleware(require('./update-rehab-value')),
  getCompleted: asyncMiddleware(require('./get-completed')),
  getPdf: asyncMiddleware(require('./pdf')),
  get: asyncMiddleware(require('./get')),
};
