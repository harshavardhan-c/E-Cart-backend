import { CouponsModel } from '../models/couponsModel.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Get all active coupons
 */
export const getActiveCoupons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const coupons = await CouponsModel.getActiveCoupons(parseInt(limit), offset);

    res.status(200).json({
      status: 'success',
      message: 'Active coupons retrieved successfully',
      data: {
        coupons,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: coupons.length
        }
      }
    });
  } catch (error) {
    console.error('❌ Error getting active coupons:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve coupons'
    });
  }
});

/**
 * Validate coupon code
 */
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      status: 'error',
      message: 'Coupon code is required'
    });
  }

  try {
    const validation = await CouponsModel.validateCoupon(code);

    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: validation.message
      });
    }

    res.status(200).json({
      status: 'success',
      message: validation.message,
      data: {
        coupon: validation.coupon
      }
    });
  } catch (error) {
    console.error('❌ Error validating coupon:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to validate coupon'
    });
  }
});

/**
 * Get all coupons (Admin only)
 */
export const getAllCoupons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const coupons = await CouponsModel.getAllCoupons(parseInt(limit), offset);

    res.status(200).json({
      status: 'success',
      message: 'All coupons retrieved successfully',
      data: {
        coupons,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: coupons.length
        }
      }
    });
  } catch (error) {
    console.error('❌ Error getting all coupons:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve coupons'
    });
  }
});

/**
 * Create new coupon (Admin only)
 */
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount_percent, expiry_date, max_uses = 100 } = req.body;

  // Validate input
  if (!code || !discount_percent || !expiry_date) {
    return res.status(400).json({
      status: 'error',
      message: 'Code, discount percentage, and expiry date are required'
    });
  }

  if (discount_percent <= 0 || discount_percent > 100) {
    return res.status(400).json({
      status: 'error',
      message: 'Discount percentage must be between 1 and 100'
    });
  }

  if (new Date(expiry_date) <= new Date()) {
    return res.status(400).json({
      status: 'error',
      message: 'Expiry date must be in the future'
    });
  }

  try {
    // Check if coupon code already exists
    const existingCoupon = await CouponsModel.getCouponByCode(code);
    if (existingCoupon) {
      return res.status(400).json({
        status: 'error',
        message: 'Coupon code already exists'
      });
    }

    const couponData = {
      code: code.toUpperCase(),
      discount_percent: parseInt(discount_percent),
      expiry_date: new Date(expiry_date).toISOString(),
      max_uses: parseInt(max_uses),
      current_uses: 0,
      is_active: true,
      created_at: new Date().toISOString()
    };

    const coupon = await CouponsModel.createCoupon(couponData);

    res.status(201).json({
      status: 'success',
      message: 'Coupon created successfully',
      data: { coupon }
    });
  } catch (error) {
    console.error('❌ Error creating coupon:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create coupon'
    });
  }
});

/**
 * Update coupon (Admin only)
 */
export const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const coupon = await CouponsModel.updateCoupon(id, updateData);

    if (!coupon) {
      return res.status(404).json({
        status: 'error',
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Coupon updated successfully',
      data: { coupon }
    });
  } catch (error) {
    console.error('❌ Error updating coupon:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update coupon'
    });
  }
});

/**
 * Toggle coupon status (Admin only)
 */
export const toggleCouponStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await CouponsModel.toggleCouponStatus(id);

    res.status(200).json({
      status: 'success',
      message: `Coupon ${coupon.is_active ? 'activated' : 'deactivated'} successfully`,
      data: { coupon }
    });
  } catch (error) {
    console.error('❌ Error toggling coupon status:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to toggle coupon status'
    });
  }
});

/**
 * Delete coupon (Admin only)
 */
export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await CouponsModel.deleteCoupon(id);

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting coupon:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete coupon'
    });
  }
});

export default {
  getActiveCoupons,
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon
};

