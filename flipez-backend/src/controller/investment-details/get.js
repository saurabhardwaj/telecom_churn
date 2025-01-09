const InvestmentDetailsModel = require('./investment-details.model');

const get = async (req) => {
  try {
    let query = { status: 'paid' }
    if(req.user.role !== "admin") {
      query.user = req.user._id
    }
    const investmentDetails = await InvestmentDetailsModel.find(query).select('personalInformation investmentOpportunity updatedAt').populate('user').sort({ updatedAt: -1 }).lean();
    return req.sendResponse(200, investmentDetails);
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = get;
