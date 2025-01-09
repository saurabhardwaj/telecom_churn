const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const UserModel = require('../../controller/user/user.model');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: true,
      passReqToCallback: true,
    },
    (async (req, jwtPayload, done) => {
      try {
        let token = req.headers.authorization;
        token = token.split(' ')[1];

        let user = null;
        if(!jwtPayload.email){
          user = await UserModel.findById(jwtPayload._id);
          if (!user) {
            return done('User not exists.', false);
          }
        }else{
          user = await UserModel.findOne({ email: jwtPayload.email });
          if (!user) {
            return done('User not exists.', false);
          }
        }

        return done(null, user);
      } catch (err) {
        return done('Error while checking authentication.', false);
      }
    }),
  ),
);

module.exports = null;
