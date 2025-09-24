// Express server setup - main server file
import express from 'express';
const app=express();
import dotenv from 'dotenv';
dotenv.config(); // Environment variables load karta hai
import { Connection } from './database/db.js'; // Database connection import karta hai
import router from './routes/routes.js'; // API routes import karta hai
import aiRoutes from './routes/aiRoutes.js'; // AI routes import karta hai
import cors from 'cors'; // CORS middleware import karta hai

// Middleware setup - ye sab requests pe apply hota hai
app.use(cors()); // Cross-origin requests allow karta hai
app.use(express.json()); // JSON data parse karta hai
app.use(express.urlencoded({ extended: true })); // URL-encoded data parse karta hai
app.use('/uploads', express.static('uploads')); // Uploaded files serve karta hai

// Server configuration
const PORT=8000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
Connection(); // Database connect karta hai

// API routes setup - sab routes yahan pe mount hote hain
app.use('/',router); // Main blog routes
app.use('/api/ai', aiRoutes); // AI vlog generation routes