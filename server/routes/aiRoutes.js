// AI Routes - AI related endpoints handle karta hai
// Ye file mein hum AI vlog generation ke liye routes define karenge

import express from 'express';
import { generateVlogScript, generateVlogIdeas, generateThumbnailIdeas } from '../controller/aiVlog.js';

const router = express.Router();

// AI Vlog Generation Routes
// POST /api/ai/generate-vlog-script - vlog script generate karta hai
router.post('/generate-vlog-script', generateVlogScript);

// POST /api/ai/generate-vlog-ideas - vlog ideas generate karta hai
router.post('/generate-vlog-ideas', generateVlogIdeas);

// POST /api/ai/generate-thumbnail-ideas - thumbnail ideas generate karta hai
router.post('/generate-thumbnail-ideas', generateThumbnailIdeas);

export default router;
