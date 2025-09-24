// AI Vlog Generation Controller - AI se vlog content generate karta hai
// Ye file mein hum Gemini AI use karke vlog scripts, ideas aur thumbnails generate karenge

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Gemini AI client initialize karta hai - ye function mein initialize karenge
// Ye Google ka AI model hai jo text generate karta hai
const getLLM = () => {
    return new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY || "your_gemini_api_key_here", // .env file se API key le raha hai
        modelName: "gemini-1.5-pro", // Gemini model use kar raha hai
        temperature: 0.8, // Creativity level (0-1, higher = more creative)
    });
};

// Vlog script generate karta hai - ye main function hai
export const generateVlogScript = async (req, res) => {
    try {
        // API key check karta hai
        if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "your_gemini_api_key_here") {
            return res.status(400).json({
                isSuccess: false,
                message: 'Please add your Gemini API key to the .env file'
            });
        }

        // Request body se data extract karta hai
        const { topic, duration, style, targetAudience } = req.body;
        
        // Topic check karta hai - agar nahi hai to error
        if (!topic) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Vlog topic is required' // Error message
            });
        }

        // System prompt - AI ko batata hai ki kya karna hai
        const systemPrompt = `You are a professional vlog script writer. 
        Create engaging, conversational vlog scripts that are perfect for YouTube and social media.
        The script should be natural, engaging, and include:
        - Hook (first 15 seconds) - audience ko attract karna
        - Main content with clear structure - main topic cover karna
        - Call-to-action - audience ko kuch karne ko kehna
        - Natural transitions - smooth flow ke liye
        - Engaging storytelling techniques - interesting banane ke liye`;

        // User prompt - specific requirements
        const userPrompt = `Create a ${duration || '5-10 minute'} vlog script about "${topic}".
        Style: ${style || 'casual and friendly'}
        Target Audience: ${targetAudience || 'general audience'}
        
        Include:
        1. Opening hook - pehle 15 seconds mein audience ko engage karo
        2. Main content sections - topic ko detail mein cover karo
        3. Transitions - sections ke beech mein smooth flow
        4. Call-to-action - audience ko subscribe, like karne ko kehna
        5. Closing remarks - video ko properly end karna`;

        // Gemini AI se response generate karta hai
        const llm = getLLM();
        const response = await llm.invoke([
            new SystemMessage(systemPrompt), // System instructions
            new HumanMessage(userPrompt) // User request
        ]);

        // AI response ko parse karta hai
        const scriptContent = response.content;
        
        // Different sections extract karta hai
        const sections = {
            hook: extractSection(scriptContent, 'hook', 'opening'),
            mainContent: extractSection(scriptContent, 'main content', 'body'),
            transitions: extractSection(scriptContent, 'transitions', 'flow'),
            callToAction: extractSection(scriptContent, 'call-to-action', 'cta'),
            closing: extractSection(scriptContent, 'closing', 'end')
        };

        // Success response bhejta hai
        return res.status(200).json({
            isSuccess: true,
            message: 'Vlog script generated successfully',
            data: {
                topic: topic,
                duration: duration,
                style: style,
                targetAudience: targetAudience,
                fullScript: scriptContent, // Complete script
                sections: sections, // Different parts
                wordCount: scriptContent.split(' ').length, // Word count
                estimatedDuration: Math.ceil(scriptContent.split(' ').length / 150) // ~150 words per minute
            }
        });

    } catch (err) {
        console.log('Error while generating vlog script:', err);
        return res.status(500).json({
            isSuccess: false,
            message: 'Internal server error'
        });
    }
};

// Vlog ideas generate karta hai - different topics ke liye
export const generateVlogIdeas = async (req, res) => {
    try {
        // API key check karta hai
        if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "your_gemini_api_key_here") {
            return res.status(400).json({
                isSuccess: false,
                message: 'Please add your Gemini API key to the .env file'
            });
        }

        const { category, count = 5 } = req.body;
        
        // System prompt for idea generation
        const systemPrompt = `You are a creative vlog content strategist. 
        Generate unique, trending vlog ideas that are engaging and have viral potential.`;

        const userPrompt = `Generate ${count} unique vlog ideas for the "${category || 'general'}" category.
        Each idea should include:
        - Title - catchy aur interesting
        - Brief description - kya hoga is video mein
        - Target audience - kaun dekh sakta hai
        - Estimated duration - kitna time lagega
        - Key talking points - main points kya honge
        - Potential viral elements - viral hone ke chances`;

        const llm = getLLM();
        const response = await llm.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(userPrompt)
        ]);

        // Ideas ko parse karta hai
        const ideas = parseVlogIdeas(response.content, count);

        return res.status(200).json({
            isSuccess: true,
            message: 'Vlog ideas generated successfully',
            data: {
                category: category,
                ideas: ideas,
                count: ideas.length
            }
        });

    } catch (err) {
        console.log('Error while generating vlog ideas:', err);
        return res.status(500).json({
            isSuccess: false,
            message: 'Internal server error'
        });
    }
};

// Thumbnail ideas generate karta hai - YouTube thumbnails ke liye
export const generateThumbnailIdeas = async (req, res) => {
    try {
        // API key check karta hai
        if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "your_gemini_api_key_here") {
            return res.status(400).json({
                isSuccess: false,
                message: 'Please add your Gemini API key to the .env file'
            });
        }

        const { vlogTitle, style = 'modern' } = req.body;
        
        if (!vlogTitle) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Vlog title is required'
            });
        }

        const systemPrompt = `You are a YouTube thumbnail design expert. 
        Create compelling thumbnail concepts that increase click-through rates.`;

        const userPrompt = `Create 5 thumbnail design concepts for the vlog titled: "${vlogTitle}"
        Style: ${style}
        
        Each concept should include:
        - Visual elements - kya dikhega thumbnail mein
        - Text overlay suggestions - kya text likhna hai
        - Color scheme - kaun se colors use karne hain
        - Composition tips - layout kaise banaye
        - Emotional appeal strategy - audience ko kaise attract kare`;

        const llm = getLLM();
        const response = await llm.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(userPrompt)
        ]);

        const thumbnailIdeas = parseThumbnailIdeas(response.content);

        return res.status(200).json({
            isSuccess: true,
            message: 'Thumbnail ideas generated successfully',
            data: {
                vlogTitle: vlogTitle,
                style: style,
                thumbnailIdeas: thumbnailIdeas
            }
        });

    } catch (err) {
        console.log('Error while generating thumbnail ideas:', err);
        return res.status(500).json({
            isSuccess: false,
            message: 'Internal server error'
        });
    }
};

// Helper function - script se different sections extract karta hai
function extractSection(content, keyword, fallback) {
    const lines = content.split('\n');
    let section = [];
    let found = false;
    
    // Har line check karta hai
    for (let line of lines) {
        if (line.toLowerCase().includes(keyword.toLowerCase()) || 
            line.toLowerCase().includes(fallback.toLowerCase())) {
            found = true;
            continue;
        }
        if (found && line.trim() === '') break; // Empty line pe stop
        if (found) section.push(line);
    }
    
    return section.join('\n').trim();
}

// Helper function - vlog ideas ko parse karta hai
function parseVlogIdeas(content, count) {
    const ideas = [];
    const lines = content.split('\n');
    let currentIdea = {};
    
    for (let line of lines) {
        // Numbered list check karta hai (1., 2., etc.)
        if (line.match(/^\d+\./)) {
            if (Object.keys(currentIdea).length > 0) {
                ideas.push(currentIdea);
            }
            currentIdea = { title: line.replace(/^\d+\.\s*/, '') };
        } else if (line.includes('Description:')) {
            currentIdea.description = line.replace('Description:', '').trim();
        } else if (line.includes('Audience:')) {
            currentIdea.audience = line.replace('Audience:', '').trim();
        } else if (line.includes('Duration:')) {
            currentIdea.duration = line.replace('Duration:', '').trim();
        }
    }
    
    if (Object.keys(currentIdea).length > 0) {
        ideas.push(currentIdea);
    }
    
    return ideas.slice(0, count); // Max count tak hi return karta hai
}

// Helper function - thumbnail ideas ko parse karta hai
function parseThumbnailIdeas(content) {
    const ideas = [];
    const lines = content.split('\n');
    let currentIdea = {};
    
    for (let line of lines) {
        if (line.match(/^\d+\./)) {
            if (Object.keys(currentIdea).length > 0) {
                ideas.push(currentIdea);
            }
            currentIdea = { concept: line.replace(/^\d+\.\s*/, '') };
        } else if (line.includes('Visual:')) {
            currentIdea.visual = line.replace('Visual:', '').trim();
        } else if (line.includes('Text:')) {
            currentIdea.text = line.replace('Text:', '').trim();
        } else if (line.includes('Colors:')) {
            currentIdea.colors = line.replace('Colors:', '').trim();
        }
    }
    
    if (Object.keys(currentIdea).length > 0) {
        ideas.push(currentIdea);
    }
    
    return ideas;
}
