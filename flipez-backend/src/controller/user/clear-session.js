const PropertyDetailsModel = require('../property-details/property-details.model');
const InvestmentDetailsModel = require('../investment-details/investment-details.model');
const clearSession = async (req) => {
  try {
    await PropertyDetailsModel.findOneAndUpdate({ user: req.user._id, status: 'pending' }, { $set: { status: 'expired' } }).lean();
    await InvestmentDetailsModel.findOneAndUpdate({ user: req.user._id, status: 'pending' }, { $set: { status: 'expired' } }).lean();
    return req.sendResponse(200, { message: 'User details updated successfully' });
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = clearSession;
