import { supabase } from '../config/supabaseClient.js';

export class WishlistModel {
  /**
   * Get wishlist items for a user
   */
  static async getWishlistByCustomerId(userId) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          product_id,
          added_at,
          products (
            id,
            name,
            price,
            image_url,
            category,
            description,
            discount_percent,
            stock,
            brand
          )
        `)
        .eq('customer_id', userId)
        .order('added_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting wishlist:', error.message);
      throw error;
    }
  }

  /**
   * Add product to wishlist
   */
  static async addToWishlist(userId, productId) {
    try {
      // Check if item already exists in wishlist
      const { data: existing } = await supabase
        .from('wishlist')
        .select('id')
        .eq('customer_id', userId)
        .eq('product_id', productId)
        .single();

      if (existing) {
        throw new Error('Product already in wishlist');
      }

      const { data, error } = await supabase
        .from('wishlist')
        .insert({
          customer_id: userId,
          product_id: productId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding to wishlist:', error.message);
      throw error;
    }
  }

  /**
   * Remove product from wishlist
   */
  static async removeFromWishlist(userId, productId) {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('customer_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error removing from wishlist:', error.message);
      throw error;
    }
  }

  /**
   * Clear entire wishlist
   */
  static async clearWishlist(userId) {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('customer_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error clearing wishlist:', error.message);
      throw error;
    }
  }

  /**
   * Get wishlist count
   */
  static async getWishlistCount(userId) {
    try {
      const { count, error } = await supabase
        .from('wishlist')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', userId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting wishlist count:', error.message);
      throw error;
    }
  }
}