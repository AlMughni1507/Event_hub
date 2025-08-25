const nodemailer = require('nodemailer');
require('dotenv').config({ path: './config.env' });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `${process.env.SMTP_FROM_NAME || 'Event Platform'} <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
}

function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

function otpEmailTemplate(code) {
  return `
  <div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
    <h2>Verifikasi Email</h2>
    <p>Kode OTP Anda:</p>
    <div style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</div>
    <p style="margin-top:12px;color:#555">Kode berlaku 10 menit.</p>
  </div>`;
}

module.exports = {
  sendEmail,
  generateOtpCode,
  otpEmailTemplate
};
