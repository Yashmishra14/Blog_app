// User model - database schema for user data
import mongoose from "mongoose";

// User schema definition - user ki data structure define karta hai
const userSchema=new mongoose.Schema({
     name : {
        type: String,
        required: true // Name field mandatory hai
     },
     email: {
        type: String,
        required: true, // Email field mandatory hai
        unique: true // Email unique hona chahiye (duplicate nahi ho sakta)
     },
     password:{
        type: String,
        required: true // Password field mandatory hai
     }
})

// User model export karta hai - isse database operations kar sakte hain
export const User=mongoose.model('User',userSchema);