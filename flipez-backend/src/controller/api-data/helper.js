const ApiDataModel = require("./Api-data.model");
const saveApiData = async (data) => {
    try {
        data.address = data.address.replace(/,/g, "");
        await ApiDataModel.findOneAndUpdate({ address: data.address }, { $set: data }, { upsert: true, new: true });
        return true;
    } catch (error) {
        return false;
    }
}

const getApiData = async (address) => {
    try {
        const data = await ApiDataModel.findOne({ address: address.replace(/,/g, "") }).lean();
        return data;
    } catch (error) {
        return false;
    }
}

module.exports = {
    saveApiData,
    getApiData
}