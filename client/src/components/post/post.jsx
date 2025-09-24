// React hooks aur routing ke liye imports
import React, { useState, useEffect } from 'react';
import { useSearchParams,Link } from 'react-router-dom'; // URL parameters handle karne ke liye
import ApiService from '../../service/api'; // API calls ke liye service
import UpdatePost from '../create/update';

// Post component - sab posts display karta hai with category filtering
const Post = () => {
  // State variables - component ki current state track karte hain
  const [posts, setPosts] = useState([]); // All posts from database
  const [filteredPosts, setFilteredPosts] = useState([]); // Filtered posts based on category
  const [loading, setLoading] = useState(true); // Loading state - data fetch ho raha hai ya nahi
  const [error, setError] = useState(null); // Error state - koi error aaya hai ya nahi
  const [searchParams] = useSearchParams(); // URL parameters get karta hai
  const selectedCategory = searchParams.get('category'); // Selected category from URL

  // Component mount hone pe posts fetch karta hai
  useEffect(() => {
    fetchPosts();
  }, []);

  // Category filtering - selected category ke basis pe posts filter karta hai
  useEffect(() => {
    if (selectedCategory) {
      // Agar category select hai to sirf us category ke posts show karta hai
      const filtered = posts.filter(post => 
        post.categories && post.categories.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredPosts(filtered);
    } else {
      // Agar koi category select nahi hai to sab posts show karta hai
      setFilteredPosts(posts);
    }
  }, [posts, selectedCategory]);

  // Posts fetch karne ke liye function - server se data leke aata hai
  const fetchPosts = async () => {
    try {
      setLoading(true); // Loading state start karta hai
      console.log('Fetching posts...');
      const response = await ApiService.getAllPosts(); // API call karta hai
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      // API response format: { isSuccess: true, data: [posts] }
      setPosts(response.data?.data || []); // Posts state mein store karta hai
      setError(null); // Error clear karta hai
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.'); // Error message set karta hai
    } finally {
      setLoading(false); // Loading state stop karta hai
    }
  };

  // Date format karne ke liye function - readable format mein convert karta hai
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', // Full year (2024)
      month: 'long', // Full month name (January)
      day: 'numeric', // Day number (15)
      hour: '2-digit', // Hour in 24-hour format (14)
      minute: '2-digit' // Minutes (30)
    });
  };

  // Debug logs - development ke time helpful hote hain
  console.log('Posts state:', posts);
  console.log('Filtered posts:', filteredPosts);
  console.log('Selected category:', selectedCategory);
  console.log('Posts length:', posts.length);
  console.log('Filtered posts length:', filteredPosts.length);
  
  // Image debugging - check if posts have images
  if (filteredPosts.length > 0) {
    console.log('First post image data:', {
      hasPicture: !!filteredPosts[0].picture,
      pictureLength: filteredPosts[0].picture?.length,
      pictureStart: filteredPosts[0].picture?.substring(0, 50),
      fullPost: filteredPosts[0]
    });
  }

  // Loading state - data fetch ho raha hai to spinner show karta hai
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Error state - API call fail ho gayi to error message show karta hai
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Posts</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPosts} // Retry button - posts fetch karne ke liye
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - koi posts nahi hai to empty message show karta hai
  if (filteredPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {selectedCategory ? `No Posts in ${selectedCategory} Category` : 'No Posts Yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedCategory 
                ? `No posts found in the ${selectedCategory} category. Try creating a post in this category!`
                : 'Start creating your first blog post to see it here!'
              }
            </p>
            <a
              href="/create" // Create post page pe redirect karta hai
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Post
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Main render - posts display karta hai
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header section - title aur navigation */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedCategory ? `${selectedCategory} Posts` : 'Your Blog Posts'}
          </h1>
          <p className="text-gray-600">
            {selectedCategory 
              ? `Posts in the ${selectedCategory} category`
              : 'Manage and view all your published posts'
            }
          </p>
          {selectedCategory && (
            <button
              onClick={() => window.history.back()} // Back button - categories page pe wapas jata hai
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              ← Back to Categories
            </button>
          )}
        </div>

        {/* Debug Section - Development ke time helpful */}
        {process.env.NODE_ENV === 'development' && filteredPosts.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info (Development Only)</h3>
            <div className="text-xs text-yellow-700">
              <p>Total Posts: {filteredPosts.length}</p>
              <p>First Post Picture: {filteredPosts[0].picture ? 'Yes' : 'No'}</p>
              <p>Picture Length: {filteredPosts[0].picture?.length || 0}</p>
              <p>Picture Type: {filteredPosts[0].picture?.substring(0, 20) || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Posts Grid - sab posts ko cards mein display karta hai */}
        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
            <div key={post._id || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Post Image - agar image hai to show karta hai */}
              {post.picture && post.picture.trim() !== '' ? (
                <div className="h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={post.picture}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.log('Image failed to load:', post.picture);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', post.title);
                    }}
                  />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No image available</p>
                  </div>
                </div>
              )}

              {/* Post Content - post ki details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {post.categories} {/* Category badge */}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(post.createdDate)} {/* Formatted date */}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title} {/* Post title */}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.description} {/* Post description */}
                </p>

                {/* Post footer - author aur action buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>By {post.username || 'Anonymous'}</span> {/* Author name */}
                  </div>

                  {/* Action buttons - edit aur delete (future functionality) */}
                  <div className="flex space-x-2">
                    <Link to={`/UpdatePost/${post._id}`}>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Edit
                      </button>
                    </Link>
                    <Link to={`/DeletePost?postId=${post._id}`}>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Delete
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons - posts reload aur test ke liye */}
        <div className="mt-8 text-center space-x-4">
          <button
            onClick={fetchPosts} // Posts fetch karne ke liye
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Posts
          </button>
          
          <a
            href="/create" // Create post page pe redirect karta hai
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Post
          </a>
        </div>
      </div>
    </div>
  );
};

export default Post;
