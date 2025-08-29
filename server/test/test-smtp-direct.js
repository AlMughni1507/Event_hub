require('dotenv').config({ path: './config.env' });
const nodemailer = require('nodemailer');

console.log('🔧 SMTP Configuration Test');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);
console.log('Pass:', process.env.SMTP_PASS ? 'Set (length: ' + process.env.SMTP_PASS.length + ')' : 'NOT SET');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function testDirectSMTP() {
  try {
    console.log('\n🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');

    console.log('\n📧 Sending test OTP email...');
    const result = await transporter.sendMail({
      from: `"EventHub Platform" <${process.env.SMTP_FROM_EMAIL}>`,
      to: 'eventhubplatform2024@gmail.com',
      subject: '🔐 Your EventHub OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎪 EventHub Platform</h1>
          </div>
          
          <div style="padding: 40px 30px; background: white;">
            <h2 style="color: #1e293b;">Your OTP Code</h2>
            
            <div style="background: #f1f5f9; border: 3px solid #4f46e5; border-radius: 15px; padding: 30px; text-align: center; margin: 30px 0;">
              <div style="color: #4f46e5; font-size: 48px; font-weight: bold; letter-spacing: 8px;">123456</div>
              <p style="color: #64748b; margin: 15px 0 0 0;">Enter this code to verify your email</p>
            </div>
            
            <p style="color: #64748b;">This code will expire in 10 minutes.</p>
          </div>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('📬 Check Gmail inbox for the test email');

  } catch (error) {
    console.error('❌ SMTP Test Failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    console.error('Full error:', error);
  }
}

testDirectSMTP();
