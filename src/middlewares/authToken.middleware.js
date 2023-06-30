const { apiErrorResponse, HTTP_STATUS } = require("../utils/api.utils");

const authToken = async (req, res, next) => {
  const user = req.user;

  if (user) {
    return next();
  } else {
    const response = apiErrorResponse("Unauthenticated");
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
  }
};

module.exports = {
  authToken,
};
