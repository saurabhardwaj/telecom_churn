const UserModel = require('../user/user.model');
const { jwtSignUser } = require('./helper');

async function verifyCode(req, res) {
    let user = await UserModel.findOne({ email: req.user.email }).lean();
    if (!user) {
        return req.sendResponse(402, 'Invalid verification code.');
    }
    user = await UserModel.findAndUpdate({ _id: user._id }, { isVerified: true, verificationCode: '' }, { new: true }).lean();

    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    delete user.previousPassword;

    const generatedToken = jwtSignUser({ _id: user._id, email: user.email });

    res.cookie('token', generatedToken);

    return req.sendResponse(200, {
      user: user,
      token: generatedToken,
      message: `'Account verified successfully`,
    });
}

module.exports = verifyCode;