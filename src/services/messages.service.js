const path = require("path");
const { transporter, twilioClient } = require("../utils/messenger.utils");
const {
  GMAIL_AUTHOR,
  TWILIO_PHONE_NUMBER,
  TWILIO_VERIFIED_CALLER,
} = require("../config/env.config");
const { tokenResetPassword } = require("../utils/jwt.utils");

class MessagesService {
  // Send an email to confirm a new ticket order.
  async ticketCreatedEmail(createNewTicket) {
    const mailParams = {
      from: GMAIL_AUTHOR,
      to: createNewTicket.purchaser,
      subject: "CheckOut Confirmation",
      html: `
        <h1>Order confirm ${createNewTicket.code}</h1>
        <h3>Thank you!</h3>
        `,
      attachments: [
        {
          filename: "invoicePlaceholder.jpg",
          path: path.resolve(__dirname, "../public/img/invoicePlaceholder.jpg"),
          cid: "PurchaseConfirm",
        },
      ],
    };

    await transporter.sendMail(mailParams);
  }

  // Send an SMS to confirm a new ticket order.
  async ticketCreatedSMS(createNewTicket) {
    await twilioClient.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to: TWILIO_VERIFIED_CALLER,
      body: `Your order: ${createNewTicket.code} has been confirmed. Delivery will be made within the next 2 weeks.`,
    });
  }

  // Send an email with a password reset link.
  async resetPasswordEmail(req) {
    const { email } = req.body;
    const token = tokenResetPassword(email);
    const link = `http://localhost:8080/newPassword?token=${token}`;
    const mailParams = {
      from: GMAIL_AUTHOR,
      to: email,
      subject: "Reset Password",
      html: `
      <h3>Click <a href="${link}">here</a> to reset your password. This link will expire in 1 hour.</h3>
      <h5>Ignore this email if you don't want to change your password</h5>
      `,
      attachments: [],
    };

    await transporter.sendMail(mailParams);
  }
}

module.exports = { MessagesService };
