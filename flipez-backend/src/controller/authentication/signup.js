const UserModel = require('../user/user.model');
const { jwtSignUser } = require('./helper');
const emailProvider = require('../../lib/email');
function generateOTP() {
  // Generate a random number between 100000 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); // Convert it to a string
}

const signup = async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase()
    let existingEmail = await UserModel.findOne({
      email: req.body.email,
      isActive: true,
      isDeleted: false,
    });
    if (existingEmail && existingEmail.password) {
      return req.sendResponse(402, 'Email already exists.');
    }
    let userJson;
    if (existingEmail && !existingEmail.password) {
      existingEmail = Object.assign(existingEmail, req.body);
      userJson = await existingEmail.save();
    } else {
      const verificationCode = generateOTP();
      req.body.verificationCode = verificationCode;
      const createUser = new UserModel(req.body);
      // code for send varification code
      userJson = await createUser.save();
      const option = {
        name: `${req.body.firstName} ${req.body.lastName}`,
        code: verificationCode,
      };
      await emailProvider.sendEmail(
        req.body.email,
        'Verification Code',
        'verification-code',
        option,
      );
    }
    userJson = userJson.toJSON();

    delete userJson.password;
    delete userJson.createdAt;
    delete userJson.updatedAt;
    delete userJson.previousPassword;
    delete userJson.__v;

    const generatedToken = jwtSignUser({ _id: userJson._id, email: userJson.email });

    res.cookie('token', generatedToken);
    
    return req.sendResponse(200, {
      user: userJson,
      token: generatedToken,
      message: 'Awesome! user registered successfully',
    });
  } catch (err) {
    return req.sendResponse(500, err);
  }
};

module.exports = signup;
