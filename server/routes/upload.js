const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const ApiResponse = require('../middleware/response');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload single image
router.post('/image', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return ApiResponse.badRequest(res, 'No image file provided');
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    return ApiResponse.success(res, {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      url: imageUrl
    }, 'Image uploaded successfully');

  } catch (error) {
    console.error('Upload error:', error);
    return ApiResponse.error(res, 'Failed to upload image');
  }
});

// Upload multiple images
router.post('/images', authenticateToken, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return ApiResponse.badRequest(res, 'No image files provided');
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`
    }));
    
    return ApiResponse.success(res, {
      files: uploadedFiles,
      count: uploadedFiles.length
    }, 'Images uploaded successfully');

  } catch (error) {
    console.error('Upload error:', error);
    return ApiResponse.error(res, 'Failed to upload images');
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return ApiResponse.badRequest(res, 'File too large. Maximum size is 5MB');
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return ApiResponse.badRequest(res, 'Too many files. Maximum is 5 files');
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return ApiResponse.badRequest(res, 'Only image files are allowed');
  }
  
  return ApiResponse.error(res, 'Upload failed');
});

module.exports = router;
