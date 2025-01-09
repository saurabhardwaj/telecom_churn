const Joi = require('joi');

const signupSchema = Joi.object({
  firstName: Joi.string().required().label('First Name'),
  lastName: Joi.string().required().label('Last Name'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().required().label('Password'),
  phone: Joi.string().required().label('Phone'),
  role: Joi.string().required().label('Role'),
  city: Joi.string().required().label('City'),
  state: Joi.string().required().label('State'),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const socialLoginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  id: Joi.string().required(),
  name: Joi.string().required(),
  image: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required().label('Email'),
});

const resetPasswordSchema = Joi.object().keys({
  token: Joi.string().required().label('Token'),
  password: Joi.string().required().label('Password'),
});

const changePasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().required().label('Old Password'),
  newPassword: Joi.string().required().label('New Password'),
});

const verifyCodeSchema = Joi.object().keys({
  verificationCode: Joi.number().required(),
});


module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  socialLoginSchema,
  verifyCodeSchema
};
