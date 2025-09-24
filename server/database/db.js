// MongoDB connection setup - database connect karne ke liye
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config() // Environment variables load karta hai

// Database connection function - MongoDB Atlas se connect karta hai
export const Connection = async () => {
  try {
    // MongoDB connection with optimized settings for performance
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/blog';
    console.log('Connecting to MongoDB with URL:', mongoUrl);
    await mongoose.connect(mongoUrl, {
      maxPoolSize: 10, // Maximum 10 connections maintain karta hai
      serverSelectionTimeoutMS: 5000, // 5 seconds tak server select karne ki koshish karta hai
      socketTimeoutMS: 45000, // 45 seconds baad socket close kar deta hai
    })
    console.log('Database connected successfully') // Success message
  } catch (err) {
    console.log('Error while connecting to the database', err) // Error message
  }
}
