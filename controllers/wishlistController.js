import { WishlistModel } from '../models/wishlistModel.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Get user's wishlist
 */
export const getWishlist = asyncHandler(async (req, res) => {
  // Handle guest users (no authentication)
  if (!req.user || !req.user.id) {
    return res.status(200).json({
      status: 'success',
      message: 'Guest wishlist (empty)',
      data: {
        items: [],
        count: 0
      }
    });
  }

  const customerId = req.user.id;

  try {
    const wishlistItems = await WishlistModel.getWishlistByCustomerId(customerId);

    res.status(200).json({
      status: 'success',
      message: 'Wishlist retrieved successfully',
      data: {
        items: wishlistItems,
        count: wishlistItems.length
      }
    });
  } catch (error) {
    // If wishlist table doesn't exist or any DB error, return empty wishlist
    res.status(200).json({
      status: 'success',
      message: 'Wishlist retrieved (empty due to setup)',
      data: {
        items: [],
        count: 0
      }
    });
  }
});

/**
 * Add item to wishlist
 */
export const addToWishlist = asyncHandler(async (req, res) => {
  const customerId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({
      status: 'error',
      message: 'Product ID is required'
    });
  }

  const wishlistItem = await WishlistModel.addToWishlist(customerId, productId);

  res.status(201).json({
    status: 'success',
    message: 'Item added to wishlist',
    data: wishlistItem
  });
});

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const customerId = req.user.id;
  const { productId } = req.params;

  await WishlistModel.removeFromWishlist(customerId, productId);

  res.status(200).json({
    status: 'success',
    message: 'Item removed from wishlist'
  });
});

/**
 * Clear wishlist
 */
export const clearWishlist = asyncHandler(async (req, res) => {
  const customerId = req.user.id;

  await WishlistModel.clearWishlist(customerId);

  res.status(200).json({
    status: 'success',
    message: 'Wishlist cleared'
  });
});

/**
 * Get wishlist count
 */
export const getWishlistCount = asyncHandler(async (req, res) => {
  // Handle guest users (no authentication)
  if (!req.user || !req.user.id) {
    return res.status(200).json({
      status: 'success',
      message: 'Guest wishlist count',
      data: { count: 0 }
    });
  }

  const customerId = req.user.id;

  try {
    const count = await WishlistModel.getWishlistCount(customerId);

    res.status(200).json({
      status: 'success',
      message: 'Wishlist count retrieved',
      data: { count }
    });
  } catch (error) {
    // If wishlist table doesn't exist or any DB error, return count 0
    res.status(200).json({
      status: 'success',
      message: 'Wishlist count (empty due to setup)',
      data: { count: 0 }
    });
  }
});

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  getWishlistCount
};