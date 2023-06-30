const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INVALID_TOKEN: 498,
  SERVER_ERROR: 500,
};

class HttpError {
  constructor(status = 500, statusText, error) {
    this.status = status;
    this.description = statusText;
    error && (this.details = error);
  }
}

const apiSuccessResponse = (payload) => {
  return {
    success: true,
    payload,
  };
};

const apiErrorResponse = (description, error = null) => {
  return {
    success: false,
    description,
    details: error,
  };
};

module.exports = {
  apiSuccessResponse,
  apiErrorResponse,
  HTTP_STATUS,
  HttpError,
};
