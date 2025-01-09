const UserModel = require('./user.model');
const PropertyDetailsModel = require('../property-details/property-details.model');

const get = async (req) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.user.email }).lean();
    // Printing data
    delete existingUser.password;
    delete existingUser.createdAt;
    delete existingUser.updatedAt;
    delete existingUser.__v;
    const propertyDetails = await PropertyDetailsModel.findOne({ user: existingUser._id, status: 'pending' }).lean();
    existingUser.ficoScore = propertyDetails && propertyDetails.borrowerInformation ? propertyDetails.borrowerInformation.ficoScore : 0;
    return req.sendResponse(200, existingUser);
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = get;
