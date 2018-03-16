require('dotenv').config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "homie.mail.dreamhost.com",
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
    from: "jaq+tvchaos@ethelred.org",
    to: to,
    subject: subject,
    text: body
  }, (err, info) => {
    if (err) {
      console.error("Error:", err);
    }
    console.log(info);
  });
}