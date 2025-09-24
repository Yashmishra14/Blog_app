// Post model - database schema for blog posts
import mongoose from "mongoose";

// Post schema definition - blog post ki data structure define karta hai
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Title mandatory hai
        trim: true, // Extra spaces remove karta hai
        maxlength: 200 // Maximum 200 characters
    },
    description: {
        type: String,
        required: true, // Description mandatory hai
        trim: true, // Extra spaces remove karta hai
        maxlength: 5000 // Maximum 5000 characters
    },
    picture: {
        type: String,
        default: "" // Default empty string for image
    },
    username: {
        type: String,
        required: false, // Username optional hai
        trim: true, // Extra spaces remove karta hai
        maxlength: 50, // Maximum 50 characters
        default: 'Anonymous' // Default username
    },
    categories: {
        type: String,
        required: true, // Category mandatory hai
        trim: true, // Extra spaces remove karta hai
        maxlength: 100 // Maximum 100 characters
    },
    createdDate: {
        type: Date,
        default: Date.now, // Current date automatically set karta hai
        index: true // Faster sorting ke liye index add karta hai
    }
}, {
    timestamps: false, // Automatic timestamps disable karta hai (createdDate use karte hain)
    versionKey: false // __v field disable karta hai
});

// Compound index add karta hai - better query performance ke liye
postSchema.index({ createdDate: -1, username: 1 });

// Post model export karta hai - isse database operations kar sakte hain
export const Post = mongoose.model('Post', postSchema);
