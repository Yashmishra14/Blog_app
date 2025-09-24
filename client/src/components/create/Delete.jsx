// React hooks aur navigation ke liye imports
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Page navigation aur URL parameters ke liye
import ApiService from '../../service/api'; // API calls ke liye service

// DeletePost component - post delete karne ke liye confirmation page
const DeletePost = () => {
    // URL se post ID extract karta hai
    const [searchParams] = useSearchParams(); // URL parameters handle karta hai
    const postId = searchParams.get('postId'); // postId parameter extract karta hai
    const navigate = useNavigate(); // Page navigation ke liye
    const [loading, setLoading] = useState(false); // Loading state - delete operation chal rahi hai ya nahi

    // Post delete karne ke liye function
    const handleDelete = async () => {
        // Debug ke liye postId print karta hai
        console.log('Post ID from URL:', postId);
        console.log('All search params:', Object.fromEntries(searchParams.entries()));
        
        // Post ID check karta hai
        if (!postId) {
            alert('Post ID not found. Please try again.'); // Post ID nahi mila to error show karta hai
            return;
        }

        // User se confirmation lete hain delete karne ke liye
        const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
        if (!confirmed) return; // Agar user cancel kare to return kar deta hai

        setLoading(true); // Loading start karta hai
        try {
            // Actual API call karta hai delete karne ke liye
            console.log('Deleting post with ID:', postId);
            const response = await ApiService.deletePost({ postId });
            
            // API response check karta hai
            if (response?.isSuccess) {
                alert('Post deleted successfully!'); // Success message show karta hai
                navigate('/posts'); // Posts list page pe redirect karta hai
            } else {
                alert(response?.msg || 'Failed to delete post. Please try again.'); // Error message show karta hai
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Error deleting post. Please try again.'); // Error show karta hai
        } finally {
            setLoading(false); // Loading stop karta hai
        }
    };

    // Cancel button click karne pe posts list pe wapas jata hai
    const handleCancel = () => {
        navigate('/posts'); // Posts page pe redirect karta hai
    };

    // JSX return - UI render karta hai
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {/* Main container - centered card design */}
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                {/* Page heading */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Post</h2>
                
                {/* Debug info - postId show karta hai */}
                {postId ? (
                    <p className="text-sm text-gray-500 mb-2">Post ID: {postId}</p>
                ) : (
                    <p className="text-sm text-red-500 mb-2">Post ID not found in URL</p>
                )}
                
                {/* Confirmation message */}
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this post? This action cannot be undone.
                </p>
                
                {/* Action buttons */}
                <div className="flex gap-4">
                    {/* Cancel button - wapas posts list pe jata hai */}
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    
                    {/* Delete button - post delete karta hai */}
                    <button
                        onClick={handleDelete}
                        disabled={loading} // Loading ke time disable ho jata hai
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Deleting...' : 'Delete Post'} {/* Loading state show karta hai */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeletePost;