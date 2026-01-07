import { Response } from 'express';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Get all products (public)
export const getAllProducts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { category, search, available } = req.query;
    
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }
    
    if (search) {
      query.$text = { $search: search as string };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching products' });
  }
};

// Get single product by ID
export const getProductById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching product' });
  }
};

// Create new product (admin only)
export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      price,
      unit,
      stockQuantity,
      minimumOrder,
      imageUrl,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      category,
      price,
      unit,
      stockQuantity,
      minimumOrder,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating product' });
  }
};

// Update product (admin only)
export const updateProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating product' });
  }
};

// Delete product (admin only)
export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting product' });
  }
};
