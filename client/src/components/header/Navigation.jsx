// React aur routing ke liye imports
import React from "react";
import { Link } from "react-router-dom";
import blog from "../../assets/blog.svg";

// Navigation component - ye top navigation bar hai jo har page pe show hota hai
function Navigation() {

  return (
    <nav className="w-full bg-white/90 backdrop-blur-sm shadow-lg">
      {/* Navigation Bar - ye top pe logo aur menu links hain */}
      <div className="flex items-center justify-between px-6 py-3 md:py-4 max-w-5xl mx-auto">
        {/* Logo - click karne pe home page pe jata hai */}
        <Link to="/">
          <img
            src={blog}
            alt="logo"
            className="h-10 w-auto object-contain" />
        </Link>

        {/* Navigation Links - different pages ke liye menu items */}
        <div className="flex items-center gap-8 text-sm font-medium text-gray-900">
          <Link className="transition-colors duration-200 hover:text-indigo-600" to="/">Home</Link>
          <Link className="transition-colors duration-200 hover:text-indigo-600" to="/create">Create</Link>
          {/* <Link className="transition-colors duration-200 hover:text-indigo-600" to="/posts">View Posts</Link> */}
          <Link className="transition-colors duration-200 hover:text-indigo-600" to="/ai-dashboard">🤖 AI Studio</Link>
          <Link className="transition-colors duration-200 hover:text-indigo-600" to="/about">About</Link>
          <Link className="transition-colors duration-200 hover:text-indigo-600" to="/contact">Contact</Link>
          <Link className="px-4 py-2 rounded-full transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 text-white" to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
