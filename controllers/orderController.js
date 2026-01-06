import { OrdersModel } from '../models/ordersModel.js';
import { CartModel } from '../models/cartModel.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Get all orders for a customer
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const customerId = req.user.id;

  try {
    const orders = await OrdersModel.getOrdersByCustomerId(customerId);

    res.status(200).json({
      status: 'success',
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error('❌ Error getting orders:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve orders'
    });
  }
});

/**
 * Get single order by ID
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const customerId = req.user.id;

  try {
    const order = await OrdersModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if order belongs to customer
    if (order.customer_id !== customerId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Error getting order:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve order'
    });
  }
});

/**
 * Create new order
 */
export const createOrder = asyncHandler(async (req, res) => {
  const customerId = req.user.id;
  const { deliveryAddress, paymentMethod } = req.body;

  if (!deliveryAddress) {
    return res.status(400).json({
      status: 'error',
      message: 'Delivery address is required'
    });
  }

  try {
    // Get cart items
    const cartItems = await CartModel.getCartByCustomerId(customerId);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cart is empty'
      });
    }

    // Calculate total
    let total = 0;
    const orderItems = cartItems.map(item => {
      const product = item.products;
      const price = product.discount_percent > 0
        ? parseFloat((product.price * (1 - product.discount_percent / 100)).toFixed(2))
        : parseFloat(product.price);
      
      const itemTotal = price * item.quantity;
      total += itemTotal;

      return {
        product_id: product.id,
        quantity: item.quantity,
        price: price
      };
    });

    // Create order
    const orderData = {
      customer_id: customerId,
      total_amount: total,
      delivery_address: deliveryAddress,
      payment_status: 'pending',
      status: 'processing'
    };

    const order = await OrdersModel.createOrder(orderData);

    // Add order items
    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    await OrdersModel.addOrderItems(itemsWithOrderId);

    // Clear cart
    await CartModel.clearCart(customerId);

    // Get complete order with items
    const completeOrder = await OrdersModel.getOrderById(order.id);

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: completeOrder
    });
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create order'
    });
  }
});

/**
 * Update order (for payment)
 */
export const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const customerId = req.user.id;
  const updateData = req.body;

  try {
    // Verify order belongs to customer
    const order = await OrdersModel.getOrderById(orderId);
    if (!order || order.customer_id !== customerId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const updatedOrder = await OrdersModel.updateOrder(orderId, updateData);

    res.status(200).json({
      status: 'success',
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('❌ Error updating order:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update order'
    });
  }
});

export default {
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrder
};
