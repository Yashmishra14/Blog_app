// React aur routing ke liye imports
import React from "react";
import { useLocation } from "react-router-dom";
import bannerImage from "../../assets/image-1.jpg";

// Banner component - ye hero section hai jo sirf home page pe show hota hai
function Banner() {
  const location = useLocation(); // Current page ka path get karta hai
  const isHomePage = location.pathname === "/"; // Check karta hai ki home page hai ya nahi

  // Sirf home page pe banner show karta hai
  if (!isHomePage) {
    return null;
  }

  return (
    <div 
      className="w-full h-[50vh] relative flex items-center justify-center"
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Banner Text - hero section ka content */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold text-center px-4">
        <div>
          <h1>Exploring Code, Creativity, and Beyond</h1>
          <p className="text-xl mt-4 opacity-90">Decoding ideas, one blog at a time</p>
        </div>
      </div>
    </div>
  );
}

export default Banner;
