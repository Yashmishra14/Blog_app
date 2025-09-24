// Routes setup - API endpoints define karta hai
import express from 'express';
import multer from 'multer'; // File upload handle karne ke liye
import { signupUser, loginUser } from '../controller/user.js'; // User controller functions
import { createPost, getAllPosts, deletePost } from '../controller/post.js'; // Post controller functions

const router=express.Router(); // Express router create karta hai

// Multer configuration - file uploads handle karne ke liye
const storage = multer.memoryStorage(); // Memory storage use karta hai better performance ke liye

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    files: 1 // Sirf 1 file allow karta hai
  },
  fileFilter: (req, file, cb) => {
    // Sirf image files accept karta hai
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// User authentication routes
router.post('/signup',signupUser); // User registration endpoint
router.post('/login',loginUser); // User login endpoint

// Blog post routes
router.post('/posts', upload.single('image'), (req, res, next) => {
  console.log('=== MULTER MIDDLEWARE DEBUG ===');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  console.log('File field name:', req.file?.fieldname);
  console.log('File original name:', req.file?.originalname);
  console.log('File mimetype:', req.file?.mimetype);
  console.log('File size:', req.file?.size);
  next();
}, createPost); // Create new post with image upload
router.get('/posts', getAllPosts); // Get all posts
router.delete('/posts/:postId', deletePost); // Delete specific post

export default router;
