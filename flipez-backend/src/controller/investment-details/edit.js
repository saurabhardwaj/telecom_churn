const InvestmentDetailsModel = require('./investment-details.model');

const edit = async (req) => {
  try {
    const investmentDetails = await InvestmentDetailsModel.findAndUpdate({ _id: req.params.id }, { $set: req.body },{ new: true, }).lean();
    return req.sendResponse(200, investmentDetails);
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = edit;
