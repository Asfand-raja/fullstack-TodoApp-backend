const nodemailer = require("nodemailer");

let transporter = null;

try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((err) => {
    if (err) {
      console.error("⚠️ Email disabled:", err.message);
      transporter = null; // IMPORTANT
    } else {
      console.log("📧 Email server ready");
    }
  });

} catch (err) {
  console.error("⚠️ Email setup failed:", err.message);
  transporter = null;
}

exports.sendVerificationEmail = async (to, code) => {
  if (!transporter) {
    throw new Error("Email service unavailable");
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your email",
    text: `Your verification code is ${code}`,
  });
};
