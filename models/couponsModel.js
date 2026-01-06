import { supabase } from '../config/supabaseClient.js';

/**
 * Coupons Model - Handle coupon operations
 */
export class CouponsModel {
  /**
   * Create a new coupon
   * @param {Object} couponData - Coupon data
   * @returns {Promise<Object>} Created coupon
   */
  static async createCoupon(couponData) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([couponData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error creating coupon:', error.message);
      throw error;
    }
  }

  /**
   * Get coupon by ID
   * @param {string} id - Coupon ID
   * @returns {Promise<Object|null>} Coupon data or null
   */
  static async getCouponById(id) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting coupon by ID:', error.message);
      throw error;
    }
  }

  /**
   * Get coupon by code
   * @param {string} code - Coupon code
   * @returns {Promise<Object|null>} Coupon data or null
   */
  static async getCouponByCode(code) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting coupon by code:', error.message);
      throw error;
    }
  }

  /**
   * Get all active coupons
   * @param {number} limit - Number of coupons to fetch
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} List of active coupons
   */
  static async getActiveCoupons(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .gte('expiry_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting active coupons:', error.message);
      throw error;
    }
  }

  /**
   * Get all coupons (Admin only)
   * @param {number} limit - Number of coupons to fetch
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} List of all coupons
   */
  static async getAllCoupons(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting all coupons:', error.message);
      throw error;
    }
  }

  /**
   * Update coupon
   * @param {string} id - Coupon ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated coupon
   */
  static async updateCoupon(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error updating coupon:', error.message);
      throw error;
    }
  }

  /**
   * Delete coupon
   * @param {string} id - Coupon ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteCoupon(id) {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error deleting coupon:', error.message);
      throw error;
    }
  }

  /**
   * Validate coupon
   * @param {string} code - Coupon code
   * @returns {Promise<Object>} Validation result
   */
  static async validateCoupon(code) {
    try {
      const coupon = await this.getCouponByCode(code);
      
      if (!coupon) {
        return {
          valid: false,
          message: 'Coupon not found'
        };
      }

      if (!coupon.is_active) {
        return {
          valid: false,
          message: 'Coupon is inactive'
        };
      }

      if (new Date(coupon.expiry_date) < new Date()) {
        return {
          valid: false,
          message: 'Coupon has expired'
        };
      }

      return {
        valid: true,
        coupon: coupon,
        message: 'Coupon is valid'
      };
    } catch (error) {
      console.error('❌ Error validating coupon:', error.message);
      throw error;
    }
  }

  /**
   * Toggle coupon active status
   * @param {string} id - Coupon ID
   * @returns {Promise<Object>} Updated coupon
   */
  static async toggleCouponStatus(id) {
    try {
      const coupon = await this.getCouponById(id);
      if (!coupon) {
        throw new Error('Coupon not found');
      }

      const { data, error } = await supabase
        .from('coupons')
        .update({ is_active: !coupon.is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error toggling coupon status:', error.message);
      throw error;
    }
  }
}

export default CouponsModel;

