const UserModel = require('../user/user.model');
const { jwtSignForgetPasswordToken } = require('./helper');
const emailProvider = require('../../lib/email');

const forgetPassword = async (req) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email.toLowerCase(),
      isActive: true,
      isDeleted: false,
    }).populate('role');
    if (!user) {
      return req.sendResponse(402, 'User does not exists.');
    }

    await UserModel.findAndUpdate(
      { email: user.email },
      { resetPasswordToken: jwtSignForgetPasswordToken({ email: user.email }) },
    );
    const updatedUser = await UserModel.findOne({ email: user.email })
      .select({ resetPasswordToken: 1, email: 1 });

    const option = {
      name: `${user.firstName} ${user.lastName}`,
      resetPasswordLink: `${process.env.APP_URL}/reset-password?token=${updatedUser.resetPasswordToken}`,
    };

    await emailProvider.sendEmail(updatedUser.email, 'Password Reset Instructions', 'forgotPassword', option);
    return req.sendResponse(200, `Email sent successfully to ${user.email}`);
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = forgetPassword;
