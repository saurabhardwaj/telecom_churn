const {
  getZillowSearchAddressData,
  getRehabData,
  mapRehabDataWithPreviewQuestion,
  getZillowWalkTransitData,
} = require("../third-party/helper");
const PropertyDetailsModel = require("../property-details/property-details.model");
const InvestmentDetailsModel = require("./investment-details.model");
const { getApiData, saveApiData } = require("../api-data/helper");

const getSchoolRating = (schools, level) => {
  const schoolsByLevel = (schools || []).find(
    (school) => school.level === level
  );
  return schoolsByLevel ? schoolsByLevel.rating : 0;
};

const getNeighborhoodDetails = (zillowSearchAddressData, transitData) => {
  let primarySchoolRating = getSchoolRating(
    zillowSearchAddressData.schools,
    "Primary"
  );
  if (!primarySchoolRating) {
    primarySchoolRating = getSchoolRating(
      zillowSearchAddressData.schools,
      "Elementary"
    );
  }
  return {
    schools: zillowSearchAddressData.schools,
    primarySchoolRating,
    middleSchoolRating: getSchoolRating(
      zillowSearchAddressData.schools,
      "Middle"
    ),
    highSchoolRating: getSchoolRating(zillowSearchAddressData.schools, "High"),
    bikeRating:
      transitData &&
      transitData.data &&
      transitData.data.property &&
      transitData.data.property.bikeScore &&
      transitData.data.property.bikeScore.bikescore
        ? transitData.data.property.bikeScore.bikescore
        : 0,
    transportRating:
      transitData &&
      transitData.data &&
      transitData.data.property &&
      transitData.data.property.transitScore &&
      transitData.data.property.transitScore.transitscore
        ? transitData.data.property.transitScore.transitscore
        : 0,
    walkRating:
      transitData &&
      transitData.data &&
      transitData.data.property &&
      transitData.data.property.walkScore &&
      transitData.data.property.walkScore.walkscore
        ? transitData.data.property.walkScore.walkscore
        : 0,
  };
};

const getInitialInvestmentOpportunity = async (req, res) => {
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
    // Calculate Rehab Cost
    const investDetailsRahab = await mapRehabDataWithPreviewQuestion(
      propertyDetails.rehabAssessment,
      propertyDetails.interiorDetails,
      apiData?.rehabResponse
    );
    console.log("Step 1 Success");
    const { rehabData, rehabResponse } = await getRehabData(
      propertyDetails.propertyOverview.address,
      investDetailsRahab,
      apiData?.rehabResponse
    );
    console.log("Step 2 Success");
    let zillowSearchAddressData;
    if(apiData && apiData.zillowSearchAddressData) {
      zillowSearchAddressData = apiData.zillowSearchAddressData
    } else {
      zillowSearchAddressData = await getZillowSearchAddressData(
        propertyDetails.propertyOverview.address
      );
    }
    
    console.log("Step 3 Success");
    let transitData;
    if(apiData && apiData.transitData) {
      transitData = apiData.transitData
    } else {
      transitData = await getZillowWalkTransitData(
        zillowSearchAddressData.zpid
      );
    }
    console.log("Step 4 Success");
    const totalCost = (rehabData && rehabData.totalCost ? rehabData.totalCost : 0) +
    propertyDetails.propertyOverview.initialPurchasePrice;
    const loanAmount = Number((totalCost * (80 / 100)).toFixed(0));
    const contribution = Number((totalCost * (20 / 100)).toFixed(0));
    const estARV =
      propertyDetails.propertyOverview.initialPurchasePrice +
      (rehabData && rehabData.totalCost ? rehabData.totalCost : 0) +
      (propertyDetails.propertyOverview.initialPurchasePrice +
        (rehabData && rehabData.totalCost ? rehabData.totalCost : 0)) *
        (30 / 100);

    const response = {
      estARV,
      loanToARV: Number(
        ((loanAmount / estARV) * 100).toFixed(0)
      ),
      loanToValue: Number(
        (
          (loanAmount /
            totalCost) *
          100
        ).toFixed(0)
      ),
      propertyAddress: propertyDetails.propertyOverview.address,
      bedrooms: zillowSearchAddressData.bedrooms,
      bathrooms: zillowSearchAddressData.bathrooms,
      area: zillowSearchAddressData.livingArea,
      purchasePrice: propertyDetails.propertyOverview.initialPurchasePrice,
      contribution: contribution,
      loanAmount: loanAmount,
      loanPosition: propertyDetails.loanDetails.loanPosition,
      propertyPhoto: zillowSearchAddressData.hiResImageLink,
      rehabData,
      neighborhoodDetails: getNeighborhoodDetails(
        zillowSearchAddressData,
        transitData
      ),
      totalCost: totalCost,
    };
    const updateValue = {
      rehabResponse,
      address: propertyDetails.propertyOverview.address,
      neighborhoodDetails: getNeighborhoodDetails(
        zillowSearchAddressData,
        transitData
      ),
      investmentOpportunity: {
        propertyAddress: propertyDetails.propertyOverview.address,
        bedrooms: zillowSearchAddressData.bedrooms,
        bathrooms: zillowSearchAddressData.bathrooms,
        area: zillowSearchAddressData.livingArea,
        purchasePrice: propertyDetails.propertyOverview.initialPurchasePrice,
        contribution: contribution,
        loanAmount: loanAmount,
        loanPosition: propertyDetails.loanDetails.loanPosition,
        propertyPhoto: zillowSearchAddressData.hiResImageLink,
        loanToARV: response.loanToARV,
        loanToValue: response.loanToValue,
        totalCost: totalCost,
      },
      rehabAssessment: rehabData
    };
    if (zillowSearchAddressData && zillowSearchAddressData.zpid) {
      updateValue.zillowSearchAddressData = zillowSearchAddressData;
    }
    if (
      transitData &&
      transitData.data &&
      transitData.data.property &&
      transitData.data.property.bikeScore
    ) {
      updateValue.transitData = transitData;
    }
    await saveApiData(updateValue);
    await InvestmentDetailsModel.findOneAndUpdate(
      { user: req.user._id, status: "pending" },
      { $set: updateValue }
    );
    return req.sendResponse(200, response);
  } catch (error) {
    console.log("🚀 ~ getInitialInvestmentOpportunity ~ error:", error);
    return req.sendResponse(500, error);
  }
};

module.exports = getInitialInvestmentOpportunity;
