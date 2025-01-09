const PropertyDetailsModel = require('./property-details.model');

const getMyPropertyDetails = async (req) => {
    const propertyDetails = await PropertyDetailsModel.findOne({ user: req.user._id, status: 'pending' }).select('propertyOverview loanDetails borrowerInformation rehabAssessment interiorDetails lastCompleteStepNumber').lean();
    return req.sendResponse(200, propertyDetails);
}

module.exports = getMyPropertyDetails