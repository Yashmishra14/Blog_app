
// User controller - authentication logic handle karta hai
import {User} from '../model/user.js'; // User model import karta hai
import bcrypt from 'bcryptjs'; // Password hashing ke liye
import jwt from 'jsonwebtoken'; // JWT token generate karne ke liye

// Signup function - naya user register karta hai
export const signupUser=async (req,res)=>{
    try{
        const {name, email, password} = req.body; // Request se data extract karta hai
        
        // Required fields validate karta hai
        if(!name || !email || !password){
            return res.status(400).json({
                isSuccess: false, 
                message: 'Name, email, and password are required'
            });
        }
        
        // Check karta hai ki user already exist karta hai ya nahi
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                isSuccess: false, 
                message: 'User with this email already exists'
            });
        }
        
        // Password hash karta hai security ke liye
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // New user object create karta hai
        const newUser = new User({
            name,
            email,
            password: hashedPassword // Hashed password store karta hai
        });
        
        await newUser.save(); // Database mein save karta hai
        return res.status(201).json({
            isSuccess: true, 
            message: 'User signed up successfully',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    }catch(err){
        console.log('Error while signing up user', err);
        // Duplicate email error handle karta hai
        if(err.code === 11000){
            return res.status(409).json({
                isSuccess: false, 
                message: 'Already signup'
            });
        }
        // Generic error handle karta hai
        return res.status(500).json({
            isSuccess: false, 
            message: 'Already signup'
        });
    }
}

// Login function - existing user ko authenticate karta hai
export const loginUser=async (req,res)=>{
    try{
        const {email, password} = req.body; // Request se credentials extract karta hai
        
        // Required fields validate karta hai
        if(!email || !password){
            return res.status(400).json({
                isSuccess: false, 
                message: 'Email and password are required'
            });
        }
        
        // Database mein user find karta hai
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                isSuccess: false, 
                message: 'Invalid email or password'
            });
        }
        
        // Password verify karta hai bcrypt se
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                isSuccess: false, 
                message: 'Invalid email or password'
            });
        }
        
        // Successful login response
        return res.status(200).json({
            isSuccess: true, 
            message: 'Login successful',
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch(err){
        console.log('Error while logging in user', err);
        return res.status(500).json({
            isSuccess: false, 
            message: 'Internal server error'
        });
    }
}