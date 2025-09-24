// API notification messages - user ko show karne ke liye messages
export const API_NOTIFICATION_MESSAGES = {
    loading: {
        title: 'Loading...',
        message: 'Data is being loaded, please wait' // Loading state message
    },
    success: {
        title: 'Success',
        message: 'Data loaded successfully' // Success message
    },
    error: {
        title: 'Error',
        message: 'An error occurred while loading data, please try again' // Error message
    },
    requestFailure:{
        title: 'Error',
        message: 'An error occurred while processing your request, please try again' // Request failure message
    }
}

// Service URLs - API endpoints define karta hai
export const SERVICE_URLS = {
    userSignup: {
        method: 'POST',
        url: '/signup' // User registration endpoint
    },
    userLogin: {
        method: 'POST',
        url: '/login' // User login endpoint
    },
    createPost: {
        method: 'POST',
        url: '/posts' // Create new post endpoint
    },
    getAllPosts: {
        method: 'GET',
        url: '/posts' // Get all posts endpoint
    },
    deletePost: {
        method: 'DELETE',
        url: '/posts' // Delete post endpoint
    },
    // AI Vlog Generation APIs - AI se vlog content generate karne ke liye
    generateVlogScript: {
        method: 'POST',
        url: '/ai/generate-vlog-script' // Vlog script generate karta hai
    },
    generateVlogIdeas: {
        method: 'POST',
        url: '/ai/generate-vlog-ideas' // Vlog ideas generate karta hai
    },
    generateThumbnailIdeas: {
        method: 'POST',
        url: '/ai/generate-thumbnail-ideas' // Thumbnail ideas generate karta hai
    }
}