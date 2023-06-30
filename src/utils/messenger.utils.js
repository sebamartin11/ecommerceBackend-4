const {
  GMAIL_AUTHOR,
  GMAIL_PWD,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
} = require("../config/env.config");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

//EMAIL
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: GMAIL_AUTHOR,
    pass: GMAIL_PWD,
  },
  tls: { rejectUnauthorized: false },
});

//SMS
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = { transporter, twilioClient };
