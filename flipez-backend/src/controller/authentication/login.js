const UserModel = require('../user/user.model');
const { jwtSignUser } = require('./helper');
const PropertyDetailsModel = require('../property-details/property-details.model');

async function login(req, res) {
  try {
    req.body.email = req.body.email.toLowerCase()
    const { email, password } = req.body;
    let userJson = await UserModel.findOne({ email, isActive: true, isDeleted: false }).select('+password').lean();
    if(req.params.provider) {
      if(!userJson) {
        await UserModel.create({
          email: email,
          firstName:  req.body.name && req.body.name.split(" ") &&  req.body.name.split(" ").length > 0 ? req.body.name.split(" ")[0] : '',
          lastName: req.body.name && req.body.name.split(" ") &&  req.body.name.split(" ").length > 1 ? req.body.name.split(" ")[1] : '',
          provider: [{ id: req.body.id, provider: req.params.provider }],
          profilePic: req.body.image
        })
        userJson = await UserModel.findOne({ email, isActive: true, isDeleted: false }).lean();
      }
    } else {
      if (!userJson) {
        return req.sendResponse(422, 'Email is incorrect.');
      }
      const isPasswordValid = await UserModel.comparePassword(password, userJson.password);
      if (!isPasswordValid) {
        return req.sendResponse(422, 'Password is incorrect.');
      }
    }

    delete userJson.password;
    delete userJson.createdAt;
    delete userJson.updatedAt;
    delete userJson.__v;
    delete userJson.previousPassword;

    const generatedToken = jwtSignUser({ _id: userJson._id, email: userJson.email });
    const propertyDetails = await PropertyDetailsModel.findOne({ user: userJson._id, status: 'pending' }).select('lastCompleteStepNumber').lean();
    userJson.lastCompleteStepNumber = propertyDetails ? propertyDetails.lastCompleteStepNumber : 0;
    res.cookie('token', generatedToken);

    return req.sendResponse(200, {
      user: userJson,
      token: generatedToken,
      message: `Welcome ${userJson.firstName}`,
    });
  } catch (err) {
    return req.sendResponse(500, err);
  }
}

module.exports = login;
