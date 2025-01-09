const { getRehabData } = require("../third-party/helper");
const PropertyDetailsModel = require("../property-details/property-details.model");
const InvestmentDetailsModel = require("./investment-details.model");

const updateRehabValue = async (req, res) => {
  try {
    const propertyDetails = await PropertyDetailsModel.findOne({
      user: req.user._id,
      status: "pending",
    })
      .select(
        "propertyOverview loanDetails borrowerInformation rehabAssessment interiorDetails lastCompleteStepNumber"
      )
      .lean();
    const investmentDetails = await InvestmentDetailsModel.findOne({
      user: req.user._id,
      status: "pending",
    })
      .select("rehabResponse additionalRehabs")
      .lean();
    const { rehabData, rehabResponse } = await getRehabData(
      propertyDetails.propertyOverview.address,
      req.body.rehabAssessment,
      investmentDetails.rehabResponse
    );
    if(rehabData && rehabData.totalCost) {
      rehabData.totalCost = rehabData.totalCost + Number(req.body.additionalRehabs.reduce((sum, item) => sum + Number(item.cost), 0))
    }
    const estARV =
      propertyDetails.propertyOverview.initialPurchasePrice +
      (rehabData && rehabData.totalCost ? rehabData.totalCost : 0) +
      (propertyDetails.propertyOverview.initialPurchasePrice +
        (rehabData && rehabData.totalCost ? rehabData.totalCost : 0)) *
        (30 / 100);
    const loanToARV = Number(
      ((propertyDetails.loanDetails.loanAmount / estARV) * 100).toFixed(2)
    );
    const totalCost = propertyDetails.propertyOverview.initialPurchasePrice +
    (rehabData && rehabData.totalCost ? rehabData.totalCost : 0)

    let updateObj = {};

    if (rehabData && rehabData.bathRoom) {
      updateObj = {
        rehabAssessment: rehabData,
      };
    }
    const response = await InvestmentDetailsModel.findAndUpdate(
      { _id: req.params.id },
      {
        $set: updateObj,
      },
      { new: true }
    ).lean();
    response.additionalRehabs = req.body.additionalRehabs;
    return req.sendResponse(200, response);
  } catch (error) {
    return req.sendResponse(500, error);
  }
};

module.exports = updateRehabValue;
