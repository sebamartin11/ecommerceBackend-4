//this middleware is needed to be able to manage the errors with JWT

const passport = require("../middlewares/passport.middleware");
const { HTTP_STATUS } = require("../utils/api.utils");

const passportCustom = (strategy, options = {}) => {
  return async (req, res, next) => {
    await passport.authenticate(
      strategy,
      { session: false, ...options },
      (error, user, info) => {
        if (error) {
          return next(error); //specific errors
        }
        if (!user) {
          return res
            .status(HTTP_STATUS.UNAUTHORIZED)
            .json({ error: info.messages ? info.messages : `${info}` }); // authentication errors
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

module.exports = { passportCustom };
