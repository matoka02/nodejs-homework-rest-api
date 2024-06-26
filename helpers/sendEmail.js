// const sgMail = require("@sendgrid/mail");
// require("dotenv").config();

// const { SENDGRID_API_KEY } = process.env;

// sgMail.setApiKey(SENDGRID_API_KEY);

// const sendEmail = async (data) => {
//   const email = { ...data, from: "kurama.sama.024@gmail.com" };
//   await sgMail.send(email).then(()=>console.log('Email sent'));
//   return true;
// };

const nodemailer = require("nodemailer");
require("dotenv").config();

const { GMAIL_SSL_PASSWORD, EMAIL_FROM } = process.env;

const nodemailerConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_FROM,
    pass: GMAIL_SSL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: EMAIL_FROM };
  await transport.sendMail(email);
  return true;
};


module.exports = sendEmail;
