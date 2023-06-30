const jwt = require("jsonwebtoken");
const { SECRET_KEY, SESSION_KEY } = require("../config/env.config");

const generateToken = (user) => {
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: "24h" });
  return token;
};

const tokenResetPassword = (email) => {
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  return token;
};

//custom function to extract the cookie that we want
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[SESSION_KEY];
  }
  return token;
};

module.exports = { generateToken, tokenResetPassword, cookieExtractor };
