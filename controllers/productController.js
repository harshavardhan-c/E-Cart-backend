import { ProductModel } from '../models/productsModel.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Get products by category
 */
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const offset = (page - 1) * limit;

  try {
    const products = await ProductModel.getProductsByCategory(category, parseInt(limit), offset);

    res.status(200).json({
      status: 'success',
      message: `Products retrieved successfully`,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products.length
        }
      }
    });
  } catch (error) {
    console.error(`❌ Error getting ${category} products:`, error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve products'
    });
  }
});

/**
 * Get product by ID
 */
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.getProductById(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product retrieved successfully',
      data: { product }
    });
  } catch (error) {
    console.error('❌ Error getting product:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve product'
    });
  }
});

/**
 * Create new product (Admin only)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const productData = {
    ...req.body,
    category,
    created_at: new Date().toISOString()
  };

  try {
    const product = await ProductModel.createProduct(productData);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('❌ Error creating product:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product'
    });
  }
});

/**
 * Update product (Admin only)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const product = await ProductModel.updateProduct(id, updateData);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('❌ Error updating product:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product'
    });
  }
});

/**
 * Delete product (Admin only)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await ProductModel.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product'
    });
  }
});

/**
 * Get all products (Admin only)
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const products = await ProductModel.getAllProducts(parseInt(limit), offset);

    res.status(200).json({
      status: 'success',
      message: 'All products retrieved successfully',
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products.length
        }
      }
    });
  } catch (error) {
    console.error('❌ Error getting all products:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve products'
    });
  }
});

/**
 * Search products
 */
export const searchProducts = asyncHandler(async (req, res) => {
  const { q, category } = req.query;

  if (!q) {
    return res.status(400).json({
      status: 'error',
      message: 'Search query is required'
    });
  }

  try {
    const products = await ProductModel.searchProducts(q, category);

    res.status(200).json({
      status: 'success',
      message: 'Search completed successfully',
      data: {
        products,
        query: q,
        category: category || 'all'
      }
    });
  } catch (error) {
    console.error('❌ Error searching products:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search products'
    });
  }
});

/**
 * Update product stock (Admin only)
 */
export const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || typeof quantity !== 'number') {
    return res.status(400).json({
      status: 'error',
      message: 'Valid quantity is required'
    });
  }

  try {
    const product = await ProductModel.updateStock(id, quantity);

    res.status(200).json({
      status: 'success',
      message: 'Stock updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('❌ Error updating stock:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update stock'
    });
  }
});

export default {
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  searchProducts,
  updateStock
};

