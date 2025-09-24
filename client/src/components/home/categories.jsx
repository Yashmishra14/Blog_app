
// React aur routing ke liye imports
import React from "react";
import { categories } from "../../constants/data"; // Categories data import karta hai
import {Link, useNavigate} from 'react-router-dom';

// Categories component - ye different blog categories ko cards mein show karta hai
const Categories = () => {
    const navigate = useNavigate(); // Page navigation ke liye

    // Category ke posts view karne ke liye function
    const handleViewPosts = (categoryType) => {
        // Posts page pe navigate karta hai with category filter
        navigate(`/posts?category=${encodeURIComponent(categoryType)}`);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header Section - title aur create button */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">All Categories</h2>
                <Link to='/create'>
                <button className="bg-orange-400 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl">
                    Create Blog
                </button>
                </Link>
            </div>

            {/* Categories Cards Grid - responsive grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div 
                        key={category.id} 
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                    >
                        {/* Card Header - category ID aur decoration */}
                        <div className="bg-gradient-to-r from-violet-900 to-violet-900 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <span className="text-white text-sm font-medium">Category #{category.id}</span>
                                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                            </div>
                        </div>

                        {/* Card Body - category details aur actions */}
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {category.type}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Explore {category.type.toLowerCase()} related content and stories
                            </p>

                            {/* Card Actions - view posts button aur menu */}
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => handleViewPosts(category.type)}
                                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    View Posts
                                </button>
                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Card Footer - posts count aur last updated info */}
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>5 posts</span>
                                <span>Last updated 2h ago</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Category Card */}
            {/* <div className="mt-8">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors cursor-pointer group">
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Add New Category</h3>
                        <p className="text-gray-500 text-sm">Create a new category for your blog posts</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
};
export default Categories;