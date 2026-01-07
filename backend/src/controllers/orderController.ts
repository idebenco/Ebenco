import { Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Get all orders (admin gets all, customer gets their own)
export const getAllOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;
    const query: any = {};

    // If customer, only show their orders
    if (req.user?.role === 'customer') {
      query.customerId = req.user.id;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customerId', 'name email businessName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching orders' });
  }
};

// Get single order by ID
export const getOrderById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'customerId',
      'name email businessName phone'
    );

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check authorization - customer can only view their own orders
    if (
      req.user?.role === 'customer' &&
      order.customerId._id.toString() !== req.user.id
    ) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching order' });
  }
};

// Create new order (customer)
export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { items, notes, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: 'Order must have at least one item' });
      return;
    }

    // Validate and calculate order items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        res.status(404).json({ message: `Product ${item.productId} not found` });
        return;
      }

      if (!product.isAvailable) {
        res.status(400).json({ message: `Product ${product.name} is not available` });
        return;
      }

      if (item.quantity < product.minimumOrder) {
        res.status(400).json({
          message: `Minimum order for ${product.name} is ${product.minimumOrder} ${product.unit}`,
        });
        return;
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });
    }

    // Create order
    const order = await Order.create({
      customerId: req.user?.id,
      items: orderItems,
      totalAmount,
      notes,
      deliveryAddress,
      status: 'pending',
    });

    const populatedOrder = await Order.findById(order._id).populate(
      'customerId',
      'name email businessName'
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating order' });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: 'Status is required' });
      return;
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const updateData: any = { status };
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('customerId', 'name email businessName');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating order' });
  }
};

// Delete/Cancel order
export const deleteOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check authorization - customer can only cancel their own pending orders
    if (req.user?.role === 'customer') {
      if (order.customerId.toString() !== req.user.id) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      if (order.status !== 'pending') {
        res.status(400).json({
          message: 'Only pending orders can be cancelled',
        });
        return;
      }

      order.status = 'cancelled';
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
      });
    } else {
      // Admin can delete any order
      await Order.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting order' });
  }
};
