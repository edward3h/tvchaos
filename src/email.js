/* eslint-disable no-console */
require('dotenv').config();
import nodemailer from 'nodemailer';

if (!(process.env.MAIL_USER || process.env.MAIL_PW)) {
  throw new Error('Expected environment MAIL_USER and MAIL_PW');
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  requireTLS: true,
  tls: {  
    rejectUnauthorized: false
  },
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PW
  }
});

export default function sendmail(to, subject, body) {
  transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: to,
    subject: subject,
    text: body
  }, (err, info) => {
    if (err) {
      console.error('Error:', err);
    }
    console.log(info);
  });
}