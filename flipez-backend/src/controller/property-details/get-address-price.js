const { getApiData, saveApiData } = require("../api-data/helper");
const {
    getZillowSearchAddressData,
  } = require("../third-party/helper");

  
  const getAddressPrice = async (req, res) => {
    try {
      const apiData = await getApiData(req.body.address);
      let zillowSearchAddressData;
      if(apiData && apiData.zillowSearchAddressData) {
        zillowSearchAddressData = apiData.zillowSearchAddressData
      } else {
        zillowSearchAddressData = await getZillowSearchAddressData(
          req.body.address
        );
      }
      await saveApiData({ address: req.body.address, zillowSearchAddressData });
      return req.sendResponse(200, { price: (zillowSearchAddressData.price || 0)});
    } catch (error) {
      console.log("🚀 ~ getInitialInvestmentOpportunity ~ error:", error)
      return req.sendResponse(500, error);
    }
  };
  
  module.exports = getAddressPrice;
  