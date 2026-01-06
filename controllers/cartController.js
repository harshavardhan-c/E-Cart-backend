import { CartModel } from '../models/cartModel.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Get user's cart
 */
export const getCart = asyncHandler(async (req, res) => {
  // Handle guest users (no authentication)
  if (!req.user || !req.user.id) {
    return res.status(200).json({
      status: 'success',
      message: 'Guest cart (empty)',
      data: {
        items: [],
        total: 0,
        itemCount: 0
      }
    });
  }

  const customerId = req.user.id;

  const cartItems = await CartModel.getCartByCustomerId(customerId);
  const total = await CartModel.getCartTotal(customerId);
  const itemCount = await CartModel.getCartCount(customerId);

  res.status(200).json({
    status: 'success',
    message: 'Cart retrieved successfully',
    data: {
      items: cartItems,
      total: total,
      itemCount: itemCount
    }
  });
});

/**
 * Add item to cart
 */
export const addToCart = asyncHandler(async (req, res) => {
  const customerId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({
      status: 'error',
      message: 'Product ID is required'
    });
  }

  const cartItem = await CartModel.addToCart(customerId, productId, quantity || 1);

  res.status(201).json({
    status: 'success',
    message: 'Item added to cart',
    data: cartItem
  });
});

/**
 * Update cart item quantity
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      status: 'error',
      message: 'Valid quantity is required'
    });
  }

  const cartItem = await CartModel.updateQuantity(cartId, quantity);

  res.status(200).json({
    status: 'success',
    message: 'Cart item updated',
    data: cartItem
  });
});

/**
 * Remove item from cart
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const { cartId } = req.params;

  await CartModel.removeFromCart(cartId);

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart'
  });
});

/**
 * Clear cart
 */
export const clearCart = asyncHandler(async (req, res) => {
  const customerId = req.user.id;

  await CartModel.clearCart(customerId);

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared'
  });
});

/**
 * Get cart count
 */
export const getCartCount = asyncHandler(async (req, res) => {
  // Handle guest users (no authentication)
  if (!req.user || !req.user.id) {
    return res.status(200).json({
      status: 'success',
      message: 'Guest cart count',
      data: { count: 0 }
    });
  }

  const customerId = req.user.id;

  const count = await CartModel.getCartCount(customerId);

  res.status(200).json({
    status: 'success',
    message: 'Cart count retrieved',
    data: { count }
  });
});

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
};


