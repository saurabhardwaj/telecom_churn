const UserModel = require('./user.model');

const edit = async (req) => {
  try {
    let user = await UserModel.findOne({ _id: req.user._id }).lean();
    if (!user) {
      return req.sendResponse(402, 'User not found');
    }
    user = await UserModel.findAndUpdate({ _id: req.user._id }, { $set: req.body },{ new: true}).lean();
    return req.sendResponse(200, { message: 'User details updated successfully', user });
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = edit;
