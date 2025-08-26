const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  }
};

// Generate OTP code
const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// OTP email template
const otpEmailTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Event Management System</h1>
    </div>
    
    <div style="padding: 30px; background: #f9f9f9;">
      <h2 style="color: #333; margin-bottom: 20px;">Verifikasi Akun Anda</h2>
      
      <p style="color: #666; line-height: 1.6;">
        Terima kasih telah mendaftar di Event Management System. 
        Untuk mengaktifkan akun Anda, gunakan kode verifikasi (OTP) berikut:
      </p>
      
      <div style="background: #fff; border: 2px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
        <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
      </div>
      
      <p style="color: #666; line-height: 1.6;">
        <strong>Kode ini berlaku selama 10 menit.</strong><br>
        Jika Anda tidak merasa melakukan pendaftaran ini, abaikan email ini.
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 14px; margin: 0;">
          Terima kasih,<br>
          <strong>Tim Event Management</strong>
        </p>
      </div>
    </div>
  </div>
`;

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  const subject = 'Verifikasi Akun Anda - Kode OTP';
  const html = otpEmailTemplate(otp);
  return await sendEmail(email, subject, html);
};

// Welcome email template
const welcomeEmailTemplate = (fullName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">Event Management System</h1>
    </div>
    
    <div style="padding: 30px; background: #f9f9f9;">
      <h2 style="color: #333; margin-bottom: 20px;">Selamat Datang, ${fullName}!</h2>
      
      <p style="color: #666; line-height: 1.6;">
        Akun Anda telah berhasil diverifikasi dan diaktifkan. 
        Sekarang Anda dapat mengakses semua fitur Event Management System.
      </p>
      
      <div style="background: #fff; border: 2px solid #28a745; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
        <h3 style="color: #28a745; margin: 0;">✅ Akun Aktif</h3>
        <p style="color: #666; margin: 10px 0 0 0;">Anda dapat login sekarang</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 14px; margin: 0;">
          Terima kasih telah bergabung dengan kami!<br>
          <strong>Tim Event Management</strong>
        </p>
      </div>
    </div>
  </div>
`;

// Send welcome email
const sendWelcomeEmail = async (email, fullName) => {
  const subject = 'Selamat Datang di Event Management System';
  const html = welcomeEmailTemplate(fullName);
  return await sendEmail(email, subject, html);
};

module.exports = {
  sendEmail,
  generateOtpCode,
  otpEmailTemplate,
  sendOtpEmail,
  sendWelcomeEmail
};
