const viewsErrorMiddleware = (error, req, res, next) =>
  res.sendFile("/static/html/failedRequest.html");
module.exports = {
  viewsErrorMiddleware,
};
