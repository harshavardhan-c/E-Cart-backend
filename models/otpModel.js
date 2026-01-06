import { supabase } from '../config/supabaseClient.js';

/**
 * OTP Model - Handle OTP storage and verification
 */
export class OtpModel {
  /**
   * Store OTP in database
   * @param {string} email - Email address
   * @param {string} otp - OTP code
   * @param {Date} expiryTime - Expiry time
   * @param {string} purpose - Purpose: 'login' or 'signup'
   * @returns {Promise<Object>} Stored OTP data
   */
  static async createOtp(email, otp, expiryTime, purpose = 'signup') {
    try {
      // Delete any existing OTPs for this email
      await supabase
        .from('otps')
        .delete()
        .eq('email', email);

      // Insert new OTP
      const { data, error } = await supabase
        .from('otps')
        .insert([
          {
            email,
            otp,
            expires_at: expiryTime.toISOString(),
            attempts: 0,
            purpose: purpose
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error creating OTP:', error.message);
      throw error;
    }
  }

  /**
   * Get OTP by email
   * @param {string} email - Email address
   * @returns {Promise<Object|null>} OTP data or null
   */
  static async getOtpByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('otps')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting OTP:', error.message);
      throw error;
    }
  }

  /**
   * Update OTP attempts
   * @param {string} email - Email address
   * @param {number} attempts - Number of attempts
   * @returns {Promise<Object>} Updated OTP data
   */
  static async updateAttempts(email, attempts) {
    try {
      const { data, error } = await supabase
        .from('otps')
        .update({ attempts })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error updating OTP attempts:', error.message);
      throw error;
    }
  }

  /**
   * Delete OTP
   * @param {string} email - Email address
   * @returns {Promise<boolean>} Success status
   */
  static async deleteOtp(email) {
    try {
      const { error } = await supabase
        .from('otps')
        .delete()
        .eq('email', email);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error deleting OTP:', error.message);
      throw error;
    }
  }

  /**
   * Delete expired OTPs
   * @returns {Promise<number>} Number of deleted OTPs
   */
  static async deleteExpiredOtps() {
    try {
      const { data, error } = await supabase
        .from('otps')
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select();

      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      console.error('❌ Error deleting expired OTPs:', error.message);
      throw error;
    }
  }
}

export default OtpModel;

