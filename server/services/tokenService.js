const { query } = require('../db');
const emailService = require('./emailService');

class TokenService {
  // Generate 10-digit random token
  static generateToken() {
    const min = 1000000000; // 10 digits minimum
    const max = 9999999999; // 10 digits maximum
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Create attendance token for registration
  static async createAttendanceToken(registrationId, userId, eventId) {
    try {
      // Generate unique token
      let token;
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isUnique && attempts < maxAttempts) {
        token = this.generateToken().toString();
        
        // Check if token already exists
        const [existingTokens] = await query(
          'SELECT id FROM attendance_tokens WHERE token = ?',
          [token]
        );
        
        if (existingTokens.length === 0) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        throw new Error('Failed to generate unique token after multiple attempts');
      }

      // Set expiration date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Insert token into database
      const [result] = await query(
        `INSERT INTO attendance_tokens (registration_id, user_id, event_id, token, expires_at) 
         VALUES (?, ?, ?, ?, ?)`,
        [registrationId, userId, eventId, token, expiresAt]
      );

      return {
        id: result.insertId,
        token: token,
        expiresAt: expiresAt
      };

    } catch (error) {
      console.error('Error creating attendance token:', error);
      throw error;
    }
  }

  // Send token via email
  static async sendTokenEmail(userEmail, userName, eventTitle, token) {
    try {
      const emailSubject = `🎫 Token Daftar Hadir - ${eventTitle}`;
      
      const emailHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎫 Token Daftar Hadir</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Event Yukk Platform</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Halo ${userName}! 👋</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Terima kasih telah mendaftar untuk mengikuti event <strong>"${eventTitle}"</strong>.
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Untuk mendapatkan sertifikat, Anda wajib mengisi daftar hadir dengan menggunakan token di bawah ini:
            </p>
          </div>

          <div style="background: #fff; border: 3px solid #667eea; border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">🔑 Token Daftar Hadir Anda</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 3px;">${token}</span>
            </div>
            <p style="color: #666; font-size: 14px; margin: 0;">
              Token ini berlaku selama 30 hari sejak tanggal pendaftaran
            </p>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">📋 Cara Menggunakan Token:</h4>
            <ol style="color: #666; padding-left: 20px;">
              <li>Hadir di lokasi event sesuai jadwal</li>
              <li>Buka halaman daftar hadir di website Event Yukk</li>
              <li>Masukkan token di atas untuk verifikasi</li>
              <li>Setelah verifikasi berhasil, sertifikat akan tersedia</li>
            </ol>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-top: 0;">⚠️ Penting!</h4>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Token hanya bisa digunakan sekali</li>
              <li>Jangan bagikan token ini kepada orang lain</li>
              <li>Pastikan Anda hadir di event untuk mendapatkan sertifikat</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Jika Anda memiliki pertanyaan, silakan hubungi tim support Event Yukk.
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
              Email ini dikirim otomatis, harap tidak membalas.
            </p>
          </div>
        </div>
      `;

      await emailService.sendEmail({
        to: userEmail,
        subject: emailSubject,
        html: emailHTML
      });

      console.log(`✅ Token email sent to ${userEmail}`);
      return true;

    } catch (error) {
      console.error('Error sending token email:', error);
      throw error;
    }
  }

  // Verify attendance token
  static async verifyAttendanceToken(token, eventId) {
    try {
      const [tokens] = await query(
        `SELECT at.*, u.full_name, u.email, e.title as event_title 
         FROM attendance_tokens at
         JOIN users u ON at.user_id = u.id
         JOIN events e ON at.event_id = e.id
         WHERE at.token = ? AND at.event_id = ? AND at.is_used = FALSE AND at.expires_at > NOW()`,
        [token, eventId]
      );

      if (tokens.length === 0) {
        return {
          valid: false,
          message: 'Token tidak valid, sudah digunakan, atau sudah kedaluwarsa'
        };
      }

      const tokenData = tokens[0];
      return {
        valid: true,
        tokenData: tokenData,
        message: 'Token valid'
      };

    } catch (error) {
      console.error('Error verifying attendance token:', error);
      throw error;
    }
  }

  // Mark token as used and create attendance record
  static async markTokenAsUsed(tokenId, userId, eventId, ipAddress, userAgent) {
    try {
      // Start transaction
      await query('START TRANSACTION');

      // Mark token as used
      await query(
        'UPDATE attendance_tokens SET is_used = TRUE, used_at = NOW() WHERE id = ?',
        [tokenId]
      );

      // Create attendance record
      const [result] = await query(
        `INSERT INTO attendance_records (token_id, user_id, event_id, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?)`,
        [tokenId, userId, eventId, ipAddress, userAgent]
      );

      await query('COMMIT');

      return {
        success: true,
        attendanceId: result.insertId,
        message: 'Daftar hadir berhasil dicatat'
      };

    } catch (error) {
      await query('ROLLBACK');
      console.error('Error marking token as used:', error);
      throw error;
    }
  }

  // Get user's attendance tokens
  static async getUserTokens(userId) {
    try {
      const [tokens] = await query(
        `SELECT at.*, e.title as event_title, e.event_date, e.location,
                CASE 
                  WHEN at.is_used = TRUE THEN 'used'
                  WHEN at.expires_at < NOW() THEN 'expired'
                  ELSE 'active'
                END as status
         FROM attendance_tokens at
         JOIN events e ON at.event_id = e.id
         WHERE at.user_id = ?
         ORDER BY at.created_at DESC`,
        [userId]
      );

      return tokens;

    } catch (error) {
      console.error('Error getting user tokens:', error);
      throw error;
    }
  }
}

module.exports = TokenService;

