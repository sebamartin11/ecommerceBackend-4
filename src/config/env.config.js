const dotenv = require("dotenv");
const args = require("./args.config");

const environment = args.mode;

// config
dotenv.config({
  path: `./.env.${environment}`,
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: +process.env.PORT || 8080,
  SESSION_KEY: process.env.SESSION_KEY,
  SECRET_KEY: process.env.SECRET_KEY,
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL,
  PERSISTENCE: process.env.PERSISTENCE || "MONGO",
  GMAIL_AUTHOR: process.env.GMAIL_AUTHOR,
  GMAIL_PWD: process.env.GMAIL_PWD,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  TWILIO_VERIFIED_CALLER: process.env.TWILIO_VERIFIED_CALLER,
};
