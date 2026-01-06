import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../Frontend/public/uploads/products');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `product_${timestamp}_${randomId}${ext}`;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WEBP are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// All upload routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * Upload product image
 */
router.post('/product-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    // Generate public URL for the uploaded file
    const imageUrl = `/uploads/products/${req.file.filename}`;
    
    // eslint-disable-next-line no-console
    console.log('✅ Image uploaded successfully:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      url: imageUrl
    });

    res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: {
        imageUrl: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image'
    });
  }
});

/**
 * Delete uploaded image
 */
router.delete('/product-image/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../Frontend/public/uploads/products', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      // eslint-disable-next-line no-console
      console.log('✅ Image deleted:', filename);
      
      res.status(200).json({
        status: 'success',
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Image not found'
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Delete error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image'
    });
  }
});

/**
 * List uploaded images
 */
router.get('/product-images', (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../../Frontend/public/uploads/products');
    
    if (!fs.existsSync(uploadDir)) {
      return res.status(200).json({
        status: 'success',
        data: { images: [] }
      });
    }
    
    const files = fs.readdirSync(uploadDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          filename: file,
          url: `/uploads/products/${file}`,
          size: stats.size,
          created: stats.birthtime
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));
    
    res.status(200).json({
      status: 'success',
      data: { images }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ List images error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to list images'
    });
  }
});

export default router;