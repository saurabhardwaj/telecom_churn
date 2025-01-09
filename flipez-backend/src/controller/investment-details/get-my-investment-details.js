const InvestmentDetailsModel = require('./investment-details.model');

const getMyInvestmentDetails = async (req) => {
    let query = { user: req.user._id };
    if(req.query.status) query.status = req.query.status
    const investmentDetails = await InvestmentDetailsModel.findOne(query).select('personalInformation investmentOpportunity rehabAssessment previousProjects lastCompleteStepNumber marketComparison neighborhoodDetails previousProjects additionalRehabs isVisiblePotentialScore zillowRentEstimate zillowSearchAddressData').populate('personalInformation.profilePicture investmentOpportunity.kitchenImage investmentOpportunity.bathRoomImage investmentOpportunity.bedRoomImage previousProjects.propertyPhoto investmentPotentialScore').sort({ createdAt: -1 }).lean();
    return req.sendResponse(200, investmentDetails);
}

module.exports = getMyInvestmentDetails