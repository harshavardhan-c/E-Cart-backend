import { UsersModel } from '../models/usersModel.js';
import { ProductModel } from '../models/productsModel.js';
import { OrdersModel } from '../models/ordersModel.js';
import { CouponsModel } from '../models/couponsModel.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * 📊 Get admin dashboard statistics
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const orderStats = await OrdersModel.getOrderStats();
    const allProducts = await ProductModel.getAllProducts(1000, 0);
    const allUsers = await UsersModel.getAllUsers(1000, 0);
    const activeCoupons = await CouponsModel.getActiveCoupons(100, 0);

    const stats = {
      orders: orderStats,
      products: {
        total: allProducts.length,
        categories: {
          snacks: allProducts.filter(p => p.category === 'snacks').length,
          chocolates: allProducts.filter(p => p.category === 'chocolates').length,
          cosmetics: allProducts.filter(p => p.category === 'cosmetics').length,
          dry_fruits: allProducts.filter(p => p.category === 'dry_fruits').length,
          plastic_items: allProducts.filter(p => p.category === 'plastic_items').length,
          utensils: allProducts.filter(p => p.category === 'utensils').length,
          appliances: allProducts.filter(p => p.category === 'appliances').length
        }
      },
      users: {
        total: allUsers.length,
        customers: allUsers.filter(u => u.role === 'customer').length,
        admins: allUsers.filter(u => u.role === 'admin').length
      },
      coupons: {
        total: activeCoupons.length,
        active: activeCoupons.length
      }
    };

    res.status(200).json({
      status: 'success',
      message: 'Dashboard statistics retrieved successfully',
      data: { stats }
    });
  } catch (error) {
    console.error('❌ Error getting dashboard stats:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve dashboard statistics'
    });
  }
});

/**
 * 👥 Get all users (Admin only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const users = await UsersModel.getAllUsers(parseInt(limit), offset);

    res.status(200).json({
      status: 'success',
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: users.length
        }
      }
    });
  } catch (error) {
    console.error('❌ Error getting all users:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve users'
    });
  }
});

/**
 * 🧾 Update user role (Admin only)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['customer', 'admin'];
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({
      status: 'error',
      message: 'Valid role is required (customer, admin)'
    });
  }

  try {
    const user = await UsersModel.updateUser(id, { role });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('❌ Error updating user role:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user role'
    });
  }
});

/**
 * 🗑️ Delete user (Admin only)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (req.user.id === id) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete your own account'
    });
  }

  try {
    const deleted = await UsersModel.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
});

/**
 * 🧾 Get recent orders (Admin only)
 */
export const getRecentOrders = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  try {
    const orders = await OrdersModel.getAllOrders(parseInt(limit), 0);

    res.status(200).json({
      status: 'success',
      message: 'Recent orders retrieved successfully',
      data: { orders }
    });
  } catch (error) {
    console.error('❌ Error getting recent orders:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve recent orders'
    });
  }
});

/**
 * 📦 Get low stock products (Admin only)
 */
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const { threshold = 10 } = req.query;

  try {
    const allProducts = await ProductModel.getAllProducts(1000, 0);
    const lowStockProducts = allProducts.filter(product => product.stock <= parseInt(threshold));

    res.status(200).json({
      status: 'success',
      message: 'Low stock products retrieved successfully',
      data: {
        products: lowStockProducts,
        threshold: parseInt(threshold),
        count: lowStockProducts.length
      }
    });
  } catch (error) {
    console.error('❌ Error getting low stock products:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve low stock products'
    });
  }
});

/**
 * ➕ Add a new product (Admin only)
 */
export const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      image_url,
      description,
      stock,
      discount,
      stock_status,
      brand,
      featured,
      extra_images
    } = req.body;

    if (!name || !category || !price || !image_url) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, category, price, and image URL are required'
      });
    }

    const newProduct = await ProductModel.createProduct({
      name,
      category,
      price,
      image_url,
      description: description || '',
      stock: stock || 0,
      discount: discount || 0,
      stock_status: stock_status || (stock > 0 ? 'In Stock' : 'Out of Stock'),
      brand: brand || '',
      featured: featured || false,
      extra_images: extra_images || [],
      created_at: new Date().toISOString()
    });

    res.status(201).json({
      status: 'success',
      message: 'Product added successfully',
      data: { product: newProduct }
    });
  } catch (error) {
    console.error('❌ Error adding product:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add product'
    });
  }
});

/**
 * ✏️ Update an existing product (Admin only)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await ProductModel.updateProduct(id, req.body);

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or update failed'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product: updated }
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
 * ❌ Delete a product (Admin only)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await ProductModel.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or already deleted'
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

export default {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getRecentOrders,
  getLowStockProducts,
  addProduct,
  updateProduct,
  deleteProduct
};
