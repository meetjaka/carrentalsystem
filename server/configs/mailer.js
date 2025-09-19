import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log("GMAIL_PASS:", process.env.GMAIL_PASS);

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendConfirmationEmail = async (to, token) => {
  const confirmationUrl = `${process.env.FRONTEND_URL}/confirm/${token}`;
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: "Confirm your email for Car Rental System",
    html: `<p>Please confirm your email by clicking <a href='${confirmationUrl}'>here</a>.</p>`,
  });
};
