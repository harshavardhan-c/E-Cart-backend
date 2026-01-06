import { supabase } from '../config/supabaseClient.js';

/**
 * Generic Product Model - Handle all product categories
 */
export class ProductModel {
  /**
   * Get all products by category
   * @param {string} category - Product category
   * @param {number} limit - Number of products to fetch
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} List of products
   */
  static async getProductsByCategory(category, limit = 50, offset = 0) {
    try {
      // Query from unified products table with category filter
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Filter by category if provided
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`❌ Error getting ${category} products:`, error.message);
      throw error;
    }
  }

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>} Product data or null
   */
  static async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting product by ID:', error.message);
      throw error;
    }
  }

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
static async createProduct(productData) {
  try {
    const newProduct = {
      name: productData.name,
      category: productData.category,
      description: productData.description || '',
      price: Number(productData.price) || 0,
      discount: productData.discount ? Number(productData.discount) : 0,
      stock: Number(productData.stock) || 0,
      stock_status: productData.stock_status || (productData.stock > 0 ? 'In Stock' : 'Out of Stock'),
      brand: productData.brand || '',
      image_url: productData.image_url || '',
      featured: Boolean(productData.featured),
      extra_images: productData.extra_images || [],
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error creating product:', error.message);
    throw error;
  }
}

/**
 * Update product
 * @param {string} id - Product ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated product
 */
static async updateProduct(id, updateData) {
  try {
    const updatedFields = {
      name: updateData.name,
      category: updateData.category,
      description: updateData.description || '',
      price: Number(updateData.price) || 0,
      discount: updateData.discount ? Number(updateData.discount) : 0,
      stock: Number(updateData.stock) || 0,
      stock_status: updateData.stock_status || (updateData.stock > 0 ? 'In Stock' : 'Out of Stock'),
      brand: updateData.brand || '',
      image_url: updateData.image_url || '',
      featured: Boolean(updateData.featured),
      extra_images: updateData.extra_images || [],
    };

    const { data, error } = await supabase
      .from('products')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error updating product:', error.message);
    throw error;
  }
}

  /**
   * Delete product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error deleting product:', error.message);
      throw error;
    }
  }

  /**
   * Get all products (Admin only)
   * @param {number} limit - Number of products to fetch
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} List of all products
   */
  static async getAllProducts(limit = 100, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error getting all products:', error.message);
      throw error;
    }
  }

  /**
   * Search products by name
   * @param {string} searchTerm - Search term
   * @param {string} category - Optional category filter
   * @returns {Promise<Array>} List of matching products
   */
  static async searchProducts(searchTerm, category = null) {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error searching products:', error.message);
      throw error;
    }
  }

  /**
   * Update product stock
   * @param {string} id - Product ID
   * @param {number} quantity - Quantity to add/subtract
   * @returns {Promise<Object>} Updated product
   */
  static async updateStock(id, quantity) {
    try {
      // First get current stock
      const product = await this.getProductById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      const newStock = Math.max(0, product.stock + quantity);

      const { data, error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error updating stock:', error.message);
      throw error;
    }
  }
}

export default ProductModel;

