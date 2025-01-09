const {
  getZillowSearchAddressData,
  getZillowWalkTransitData,
} = require("../third-party/helper");
const PropertyDetailsModel = require("../property-details/property-details.model");
const { getApiData } = require("../api-data/helper");

const getSchoolRating = (schools, level) => {
  const schoolsByLevel = schools.find((school) => school.level === level);
  return schoolsByLevel ? schoolsByLevel.rating : 0;
};

const getNeighborhoodDetails = async (req, res) => {
  try {
    const propertyDetails = await PropertyDetailsModel.findOne({
      user: req.user._id,
      status: "pending",
    })
      .select(
        "propertyOverview loanDetails borrowerInformation rehabAssessment interiorDetails lastCompleteStepNumber"
      )
      .lean();
    const apiData = await getApiData(propertyDetails.propertyOverview.address);
    if(apiData && apiData.zillowSearchAddressData) {
      zillowSearchAddressData = apiData.zillowSearchAddressData
    } else {
      zillowSearchAddressData = await getZillowSearchAddressData(
        propertyDetails.propertyOverview.address
      );
    }
    let transitData;
    if(apiData && apiData.transitData) {
      transitData = apiData.transitData
    } else {
      transitData = await getZillowWalkTransitData(
        zillowSearchAddressData.zpid
      );
    }
    const response = {
      schools: zillowSearchAddressData.schools,
      primarySchoolRating: getSchoolRating(
        zillowSearchAddressData.schools,
        "Primary"
      ),
      middleSchoolRating: getSchoolRating(
        zillowSearchAddressData.schools,
        "Middle"
      ),
      highSchoolRating: getSchoolRating(
        zillowSearchAddressData.schools,
        "High"
      ),
      bikeRating: transitData && transitData.data && transitData.data.property && transitData.data.property.bikeScore && transitData.data.property.bikeScore.bikescore ? transitData.data.property.bikeScore.bikescore : 0,
      transportRating: transitData && transitData.data && transitData.data.property && transitData.data.property.transitScore && transitData.data.property.transitScore.transitscore ? transitData.data.property.transitScore.transitscore : 0,
      walkRating: transitData && transitData.data && transitData.data.property && transitData.data.property.walkScore && transitData.data.property.walkScore.walkscore ? transitData.data.property.walkScore.walkscore : 0,
    };
    return req.sendResponse(200, response);
  } catch (error) {
    return req.sendResponse(500, error);
  }
};

module.exports = getNeighborhoodDetails;
