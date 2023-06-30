const passport = require("passport");
const { UsersModel } = require("../models/schemas/users.schema");
const GithubStrategy = require("passport-github2").Strategy;

const passportJwt = require("passport-jwt");
const {
  SECRET_KEY,
  CLIENT_ID,
  CLIENT_SECRET,
  CALLBACK_URL,
} = require("../config/env.config");
const { cookieExtractor } = require("../utils/jwt.utils");

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt; //where are we going to extract token info

const CartsMongoDao = require("../models/daos/mongoManager/carts.mongo.dao");
const cartsDao = new CartsMongoDao();

//github strategy
passport.use(
  new GithubStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = profile._json;

        console.log({userData})

        const user = await UsersModel.findOne({ email: userData.email });
        if (!user) {
          const cartForNewUser = await cartsDao.addCart();

          const newUser = {
            first_name: userData.name.split(" ")[0],
            last_name: userData.name.split(" ")[1],
            age: userData.age,
            email: userData.email,
            github_username: userData.login,
            cart: cartForNewUser._id,
          };

          const response = await UsersModel.create(newUser);

          done(null, response._doc);
        } else {
          done(null, user);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

//JWT strategy
passport.use(
  "jwt",
  new JwtStrategy(
    {
      secretOrKey: SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    },
    async (jwt_payload, done) => {
      try {
        done(null, jwt_payload);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
