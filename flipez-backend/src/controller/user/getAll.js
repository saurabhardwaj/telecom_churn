const UserModel = require('./user.model');

const getAll = async (req) => {
  try {
    const users = await UserModel.find({}).select('firstName lastName role email').lean();
    return req.sendResponse(200, users);
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = getAll;
