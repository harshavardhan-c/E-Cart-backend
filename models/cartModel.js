import { supabase } from '../config/supabaseClient.js';

/**
 * Cart Model - Handle shopping cart operations
 */
export class CartModel {
  /**
   * Get user's cart items
   * @param {string} userId - User ID (stored as customer_id in cart table)
   * @returns {Promise<Array>} Cart items with product details
   */
  static async getCartByCustomerId(userId) {
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          products (*)
        `)
        .eq('customer_id', userId)
        .order('added_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error getting cart:', error.message);
      throw error;
    }
  }

  /**
   * Add item to cart
   * @param {string} userId - User ID
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Cart item
   */
  static async addToCart(userId, productId, quantity = 1) {
    try {
      // Check if item already exists in cart
      const { data: existing } = await supabase
        .from('cart')
        .select('*')
        .eq('customer_id', userId)
        .eq('product_id', productId)
        .single();

      if (existing) {
        // Update quantity
        const newQuantity = existing.quantity + quantity;
        const { data, error } = await supabase
          .from('cart')
          .update({ quantity: newQuantity })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Insert new item
      const { data, error } = await supabase
        .from('cart')
        .insert({
          customer_id: userId,
          product_id: productId,
          quantity: quantity
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error adding to cart:', error.message);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   * @param {string} cartId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Updated cart item
   */
  static async updateQuantity(cartId, quantity) {
    try {
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', cartId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error updating cart:', error.message);
      throw error;
    }
  }

  /**
   * Remove item from cart
   * @param {string} cartId - Cart item ID
   * @returns {Promise<boolean>} Success status
   */
  static async removeFromCart(cartId) {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);

      if (error) throw error;
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error removing from cart:', error.message);
      throw error;
    }
  }

  /**
   * Clear entire cart
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async clearCart(userId) {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('customer_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error clearing cart:', error.message);
      throw error;
    }
  }

  /**
   * Get cart total
   * @param {string} userId - User ID
   * @returns {Promise<number>} Total amount
   */
  static async getCartTotal(userId) {
    try {
      const cartItems = await this.getCartByCustomerId(userId);
      
      const total = cartItems.reduce((sum, item) => {
        const product = item.products;
        // Handle both discount and discount_percent fields for compatibility
        const discountPercent = product.discount_percent || product.discount || 0;
        const price = discountPercent > 0 
          ? product.price * (1 - discountPercent / 100)
          : product.price;
        return sum + (price * item.quantity);
      }, 0);

      return parseFloat(total.toFixed(2));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error calculating cart total:', error.message);
      throw error;
    }
  }

  /**
   * Get cart count
   * @param {string} userId - User ID
   * @returns {Promise<number>} Total items count
   */
  static async getCartCount(userId) {
    try {
      const { count, error } = await supabase
        .from('cart')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', userId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('❌ Error getting cart count:', error.message);
      return 0;
    }
  }
}

export default CartModel;










