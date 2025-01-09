const InvestmentDetailsModel = require('./investment-details.model');

const getCompleted = async (req) => {
    const investmentDetails = await InvestmentDetailsModel.find({ user: req.user._id, status: 'paid' }).select('personalInformation investmentOpportunity updatedAt').sort({ updatedAt: -1 }).lean();
    return req.sendResponse(200, investmentDetails);
}

module.exports = getCompleted