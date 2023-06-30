const args = require("../config/args.config");

const environment = args.mode;

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, simple } = format;

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "cyan",
    debug: "white",
  },
};

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] - [${level}]: ${message}`;
});

const prodLogger = createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new transports.Console({
      level: "info",
      format: combine(
        colorize({ colors: customLevelOptions.colors }),
        simple(),
        timestamp(),
        myFormat
      ),
    }),
    new transports.File({
      filename: process.cwd() + "/error.log",
      level: "error",
      format: combine(
        colorize({ colors: customLevelOptions.colors }),
        simple(),
        timestamp(),
        myFormat
      ),
    }),
  ],
});

const devLogger = createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new transports.Console({
      level: "debug",
      format: combine(
        colorize({ colors: customLevelOptions.colors }),
        simple(),
        timestamp(),
        myFormat
      ),
    }),
    new transports.File({
      filename: process.cwd() + "/error.log",
      level: "error",
      format: combine(
        colorize({ colors: customLevelOptions.colors }),
        simple(),
        timestamp(),
        myFormat
      ),
    }),
  ],
});

const logger = environment !== "production" ? devLogger : prodLogger;

module.exports = { logger };
