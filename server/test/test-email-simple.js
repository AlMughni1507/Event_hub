require('dotenv').config({ path: './config.env' });
const nodemailer = require('nodemailer');

console.log('🔧 SMTP Configuration:');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);
console.log('Pass:', process.env.SMTP_PASS ? '***configured***' : 'NOT SET');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function testEmail() {
  try {
    console.log('\n🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');

    console.log('\n📧 Sending test email...');
    const info = await transporter.sendMail({
      from: `"EventHub Platform" <${process.env.SMTP_FROM_EMAIL}>`,
      to: 'eventhubplatform2024@gmail.com',
      subject: 'Test Email - EventHub OTP System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">🧪 Test Email</h2>
          <p>This is a test email to verify the SMTP configuration is working.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0;">Test OTP Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #4f46e5; text-align: center; margin: 10px 0;">123456</div>
          </div>
          <p>If you receive this email, the SMTP configuration is working correctly!</p>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('📬 Check your Gmail inbox for the test email');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();
