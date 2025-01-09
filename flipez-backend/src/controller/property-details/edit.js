const PropertyDetailsModel = require('./property-details.model');

const edit = async (req) => {
  try {
    const propertyDetails = await PropertyDetailsModel.findAndUpdate({ _id: req.params.id }, { $set: req.body },{ new: true, }).lean();
    return req.sendResponse(200, propertyDetails);
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = edit;
