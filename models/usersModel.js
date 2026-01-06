import { supabase } from '../config/supabaseClient.js';

/**
 * Users Model - Handle user/customer operations
 * Uses only 'users' table
 */
export class UsersModel {
  /**
   * Create a new customer/user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async createUser(userData) {
    try {
      // Use users table directly
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error creating user:', error.message);
      throw error;
    }
  }

  /**
   * Get user by email
   * @param {string} email - Email address
   * @returns {Promise<Object|null>} User data or null
   */
  static async getUserByEmail(email) {
    try {
      // Use users table directly
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting user by email:', error.message);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User data or null
   */
  static async getUserById(id) {
    try {
      // Use users table directly
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting user by ID:', error.message);
      throw error;
    }
  }

  /**
   * Update user data
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  static async updateUser(id, updateData) {
    try {
      // Use users table directly
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error updating user:', error.message);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteUser(id) {
    try {
      // Use users table directly
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error deleting user:', error.message);
      throw error;
    }
  }

  /**
   * Get all users (Admin only)
   * @param {number} limit - Number of users to fetch
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} List of users
   */
  static async getAllUsers(limit = 50, offset = 0) {
    try {
      // Use users table directly
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting all users:', error.message);
      throw error;
    }
  }
}

export default UsersModel;

