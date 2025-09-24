// React aur Categories component ke liye imports
import React from "react";
import Categories from "./categories";

// Home component - ye main landing page hai jo user ko welcome karta hai
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome section - user ko greeting aur introduction */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Blog</h1>
          <p className="text-xl text-gray-600 mb-8">Start creating amazing content and sharing your ideas with the world.</p>
          {/* Get Started button - currently commented out */}
          {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl">
            Get Started
          </button> */}
        </div>
        
        {/* Categories Section - different blog categories show karta hai */}
        <Categories />
      </div>
    </div>
  );
};

export default Home;
