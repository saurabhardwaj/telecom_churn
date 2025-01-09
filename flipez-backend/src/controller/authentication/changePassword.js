const bcrypt = require('bcryptjs');
const UserModel = require('../user/user.model');

const changePassword = async (req) => {
  try {
    const existingUser = await UserModel.findOne({ _id: req.user._id, isActive: true, isDeleted: false }).select('+password').lean();
    const { oldPassword, newPassword } = req.body;
    const isPasswordValid = await UserModel.comparePassword(oldPassword, existingUser.password);
    if (!isPasswordValid) {
      return req.sendResponse(402, 'Current password is incorrect.');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.newPassword, salt);
    existingUser.previousPassword.push(hash);
    if (existingUser.previousPassword.length > 3) {
      existingUser.previousPassword.shift();
    }
    existingUser.password = newPassword;
    await UserModel.findAndUpdate({ _id: existingUser._id }, { password: hash, previousPassword: existingUser.previousPassword });
    return req.sendResponse(200, 'Password changed successfully.');
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = changePassword;
