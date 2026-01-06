import { supabase } from '../config/supabaseClient.js';

/**
 * Orders Model - Handle order operations
 */
export class OrdersModel {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order
   */
  static async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error creating order:', error.message);
      throw error;
    }
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  static async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting order:', error.message);
      throw error;
    }
  }

  /**
   * Get orders by customer ID
   * @param {string} customerId - Customer ID
   * @returns {Promise<Array>} List of orders
   */
  static async getOrdersByCustomerId(customerId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error getting orders:', error.message);
      throw error;
    }
  }

  /**
   * Update order payment status
   * @param {string} orderId - Order ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated order
   */
  static async updateOrder(orderId, updateData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error updating order:', error.message);
      throw error;
    }
  }

  /**
   * Add order items
   * @param {Array} items - Order items array
   * @returns {Promise<Array>} Created order items
   */
  static async addOrderItems(items) {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .insert(items)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error adding order items:', error.message);
      throw error;
    }
  }

  /**
   * Get all orders (Admin)
   * @returns {Promise<Array>} All orders
   */
  static async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (id, email, full_name),
          order_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error getting all orders:', error.message);
      throw error;
    }
  }
}

export default OrdersModel;
