const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  debug: true, // Enable debug logs
  logger: true // Enable logger
});

// Test SMTP connection
const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    return false;
  }
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    // Test connection first
    console.log('🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html
    };

    console.log('📤 Sending email to:', to);
    console.log('📧 From:', mailOptions.from);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    console.log(`📧 Email delivered to: ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email error details:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Full error:', error);
    throw error;
  }
};

// Generate OTP code
const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// OTP email template
const otpEmailTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎪 EventHub Platform</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Verifikasi Akun Anda</p>
    </div>
    
    <div style="padding: 40px 30px; background: white; margin: 0;">
      <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 24px;">Kode Verifikasi OTP</h2>
      
      <p style="color: #64748b; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
        Terima kasih telah mendaftar di <strong>EventHub Platform</strong>! 
        Untuk mengaktifkan akun Anda, masukkan kode verifikasi berikut di halaman registrasi:
      </p>
      
      <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border: 3px solid #4f46e5; border-radius: 15px; padding: 30px; text-align: center; margin: 30px 0;">
        <div style="color: #4f46e5; font-size: 48px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
        <p style="color: #64748b; margin: 15px 0 0 0; font-size: 14px;">Kode Verifikasi OTP</p>
      </div>
      
      <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
          ⚠️ <strong>Penting:</strong><br>
          • Kode ini berlaku selama <strong>10 menit</strong><br>
          • Jangan bagikan kode ini kepada siapa pun<br>
          • Jika Anda tidak melakukan pendaftaran, abaikan email ini
        </p>
      </div>
      
      <div style="text-align: center; margin: 40px 0;">
        <p style="color: #64748b; font-size: 14px; margin: 0;">
          Butuh bantuan? Hubungi kami di <a href="mailto:support@eventhub.com" style="color: #4f46e5;">support@eventhub.com</a>
        </p>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">
          Terima kasih telah bergabung dengan EventHub!<br>
          <strong style="color: #4f46e5;">Tim EventHub Platform</strong>
        </p>
      </div>
    </div>
    
    <div style="background: #1e293b; padding: 20px; text-align: center;">
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        © 2024 EventHub Platform. All rights reserved.
      </p>
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
