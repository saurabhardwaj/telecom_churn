const asyncMiddleware = require('../../lib/async-middleware');

module.exports = {
  login: asyncMiddleware(require('./login')),
  logout: asyncMiddleware(require('./logout')),
  signup: asyncMiddleware(require('./signup')),
  forgotPassword: asyncMiddleware(require('./forgotPassword')),
  resetPassword: asyncMiddleware(require('./resetPassword')),
  changePassword: asyncMiddleware(require('./changePassword')),
  verifyCode: asyncMiddleware(require('./verifyCode')),
  resendVerificationCode: asyncMiddleware(require('./resendVerificationCode')),
};
