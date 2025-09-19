import { sendConfirmationEmail } from "./mailer.js";

(async () => {
  try {
    await sendConfirmationEmail("meetjaka46@gmail.com", "test-token-123");
    console.log("Test email sent successfully!");
  } catch (err) {
    console.error("Error sending test email:", err);
  }
})();

// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// async function sendTestEmail() {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS,
//       },
//     });

//     const info = await transporter.sendMail({
//       from: `"Test Sender" <${process.env.GMAIL_USER}>`,
//       to: "meet32217@gmail.com", // change to your test email
//       subject: "Gmail App Password Test",
//       text: "If you get this, Gmail SMTP is working fine!",
//     });

//     console.log("✅ Email sent successfully:", info.messageId);
//   } catch (error) {
//     console.error("❌ Error sending email:", error);
//   }
// }

// sendTestEmail();
