const jwt = require('jsonwebtoken');

const jwtSignUser = (user) => {
  const tokenExprieAt = process.env.TOKEN_EXPIRE_IN;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: tokenExprieAt,
  });
};

const jwtSignForgetPasswordToken = (object) => jwt.sign(object, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRATION_TIME,
});

const randomString = (length) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

module.exports = {
  jwtSignUser,
  jwtSignForgetPasswordToken,
  randomString,
};
