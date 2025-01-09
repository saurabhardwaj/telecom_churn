const InvestmentDetailsModel = require('./investment-details.model');
const PropertyDetailsModel = require('../property-details/property-details.model');

const create = async (req) => {
  try {
    req.body.user = req.user._id;
    const propertyDetails = await PropertyDetailsModel.findOne({ user: req.user._id, status: 'pending' }).lean();
    req.body.propertyDetails = propertyDetails._id;
    delete req.body._id;
    const investmentDetails = await InvestmentDetailsModel.findOneAndUpdate({ user: req.user._id, status: 'pending' }, { $set: req.body }, { upsert: true, new: true }).lean();
    return req.sendResponse(200, investmentDetails);
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = create;
