const UserModel = require("../user/user.model");
const emailProvider = require("../../lib/email");

function generateOTP() {
  // Generate a random number between 100000 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); // Convert it to a string
}

async function resendVerificationCode(req) {
  const user = await UserModel.findOne({ email: req.user.email }).lean();
  if (!user) {
    return req.sendResponse(402, "User not found");
  }
  const verificationCode = generateOTP();
  await UserModel.findAndUpdate({ _id: user._id }, { verificationCode });
  const option = {
    name: `${user.firstName} ${user.lastName}`,
    code: verificationCode,
  };
  await emailProvider.sendEmail(
    user.email,
    "Verification Code",
    "verification-code",
    option
  );
  return req.sendResponse(200, `Verification code sent to ${user.email}`);
}

module.exports = resendVerificationCode;
