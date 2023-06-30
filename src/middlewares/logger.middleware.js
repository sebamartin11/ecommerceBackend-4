const { logger } = require("../logger/logger");

const addLogger = (req, res, next) => {
  req.logger = logger;
  logger.http(
    `[${req.method}]=> ${req.url} - ${new Date().toLocaleDateString()}`
  );
  next();
};

module.exports = addLogger;
