const axios = require("axios");
const ConfigModel = require("../config/config.modal");

const getAutoCompleteAPIKey = async () => {
  const data = await ConfigModel.findOne({ key: "RAPID_API_AUTO_COMPLETE_KEY" }).lean();
  console.log("🚀 ~ getAutoCompleteAPIKey ~ data:", data)
  return data.value;
}

const getAddress = async (req) => {
  try {
    const querystring = { query: req.query.address };
    const headers = {
      "x-rapidapi-key": await getAutoCompleteAPIKey(),
      "x-rapidapi-host": process.env.RAPID_API_HOST,
    };
    console.log("🚀 ~ getAddress ~ headers:", headers)
    const response = await axios.get(`${process.env.RAPID_API_URL}/properties/auto-complete`, {
      headers: headers,
      params: querystring,
    });
    return req.sendResponse(200, response.data);
  } catch (err) {
    console.log("🚀 ~ getAddress ~ err:", err)
    return req.sendResponse(500, err);
  }
};

module.exports = getAddress;
