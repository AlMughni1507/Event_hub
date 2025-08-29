const nodemailer = require('nodemailer');

// Direct configuration without .env file
const config = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'eventhubplatform2024@gmail.com',
    pass: 'xvqpqmkzhzjdrqnp'
  }
};

console.log('📧 Testing Gmail SMTP directly...');
console.log('Configuration:', {
  host: config.host,
  port: config.port,
  user: config.auth.user,
  pass: config.auth.pass ? '***configured***' : 'NOT SET'
});

const transporter = nodemailer.createTransporter(config);

async function sendTestEmail() {
  try {
    console.log('\n🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    console.log('\n📤 Sending test email...');
    const result = await transporter.sendMail({
      from: '"EventHub Platform" <eventhubplatform2024@gmail.com>',
      to: 'eventhubplatform2024@gmail.com',
      subject: '🧪 Test OTP Email - EventHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎪 EventHub Platform</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Test Email Verification</p>
          </div>
          
          <div style="padding: 40px 30px; background: white; margin: 0;">
            <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 24px;">Test OTP Code</h2>
            
            <p style="color: #64748b; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
              This is a test email to verify that the OTP system is working correctly.
            </p>
            
            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border: 3px solid #4f46e5; border-radius: 15px; padding: 30px; text-align: center; margin: 30px 0;">
              <div style="color: #4f46e5; font-size: 48px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">123456</div>
              <p style="color: #64748b; margin: 15px 0 0 0; font-size: 14px;">Test OTP Code</p>
            </div>
            
            <p style="color: #64748b; text-align: center;">
              If you receive this email, the SMTP configuration is working correctly! ✅
            </p>
          </div>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Check your Gmail inbox (including spam folder)');

  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
  }
}

sendTestEmail();
