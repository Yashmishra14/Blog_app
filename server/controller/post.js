// Post controller - blog post operations handle karta hai
import { Post } from '../model/post.js'; // Post model import karta hai

// Create post function - naya blog post create karta hai
export const createPost = async (req, res) => {
    const startTime = Date.now(); // Performance tracking ke liye
    try {
        const { title, description, categories, username } = req.body; // Request se data extract karta hai
        
        // Debug logging - request data check karta hai
        console.log('=== POST CREATION DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('File details:', req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file uploaded');
        
        // Required fields validate karta hai - early return agar missing hai
        if (!title || !description || !categories) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Missing required fields: title, description, categories'
            });
        }

        // Image upload handle karta hai - memory storage use karta hai
        const picture = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : '';
        
        // Debug logging - image processing
        console.log('Picture processed:', picture ? `Base64 string of length ${picture.length}` : 'No picture');

        // Post create karta hai database mein - single operation mein
        const newPost = await Post.create({
            title,
            description,
            picture,
            username: username || 'Anonymous', // Username provide karta hai ya 'Anonymous' default
            categories
        });
        
        const endTime = Date.now();
        console.log(`Post creation took ${endTime - startTime}ms`); // Performance log
        
        // Success response - created post ki details return karta hai
        return res.status(201).json({
            isSuccess: true,
            message: 'Post created successfully',
            data: {
                id: newPost._id,
                title: newPost.title,
                description: newPost.description,
                picture: newPost.picture,
                username: newPost.username,
                categories: newPost.categories,
                createdDate: newPost.createdDate
            }
        });
    } catch (err) {
        console.log('Error while creating post', err);
        return res.status(500).json({
            isSuccess: false,
            message: 'Internal server error'
        });
    }
};

// Get all posts function - sab posts retrieve karta hai
export const getAllPosts = async (req, res) => {
    try {
        // Database se sab posts fetch karta hai - newest first
        const posts = await Post.find().sort({ createdDate: -1 });
        
        return res.status(200).json({
            isSuccess: true,
            message: 'Posts retrieved successfully',
            data: posts
        });
    } catch (err) {
        console.log('Error while fetching posts', err);
        return res.status(500).json({
            isSuccess: false,
            message: 'Internal server error'
        });
    }
};

// Delete post function - specific post delete karta hai
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params; // URL se postId extract karta hai
        
        // Post ID validate karta hai
        if (!postId) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Post ID is required'
            });
        }
        
        // Post exist karta hai ya nahi check karta hai
        const existingPost = await Post.findById(postId);
        if (!existingPost) {
            return res.status(404).json({
                isSuccess: false,
                message: 'Post not found'
            });
        }
        
        // Post delete karta hai database se
        await Post.findByIdAndDelete(postId);
        
        return res.status(200).json({
            isSuccess: true,
            message: 'Post deleted successfully'
        });
    } catch (err) {
        console.log('Error while deleting post', err);
        return res.status(500).json({
            isSuccess: false,
            message: 'Internal server error'
        });
    }
};
