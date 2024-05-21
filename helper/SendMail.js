require("dotenv").config();
const nodemailer = require("nodemailer");
const MailTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SEND_MAIL_USER_NAME,
    pass: process.env.SEND_MAIL_PASSWORD,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
  logger: true, // Enable logging
  debug: true, // Enable debugging
});

module.exports = MailTransport;
