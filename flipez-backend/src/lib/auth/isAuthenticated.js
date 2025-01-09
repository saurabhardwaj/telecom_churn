const passport = require('passport');

const excludeAuthentication = ['/signup/facebook', '/signup/facebook/callback'];
module.exports = (req, res, next) => {
  const authorizeToken = req.headers.authorization;
  if (req.path && excludeAuthentication.indexOf(req.path) >= 0 && !authorizeToken) {
    next();
  } else {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        res.status(401).send({
          error: 'you do not have access to this resource',
        });
      } else {
        req.user = user;
        next();
      }
    })(req, res, next);
  }
};
