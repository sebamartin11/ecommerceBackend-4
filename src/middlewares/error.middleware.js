const { apiErrorResponse, HTTP_STATUS } = require("../utils/api.utils");

const errorMiddleware = (error, req, res, next) => {
  req.logger.error(error.description || error.message);
  const errorMessage =
    error.description || error.message || "There was an unknown error";
  const errorDetails = error.description ? null : error;

  const response = apiErrorResponse(errorMessage, errorDetails);
  return res.status(error.status || HTTP_STATUS.SERVER_ERROR).json(response);
};

module.exports = {
  errorMiddleware,
};
