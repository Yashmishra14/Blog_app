// React aur routing ke liye imports
import React from "react";
import Navigation from "./Navigation";
import Banner from "./Banner";

// Header component - ye navigation aur banner ko combine karta hai
function Header() {
  return (
    <header className="w-full">
      {/* Navigation Bar - har page pe show hota hai */}
      <Navigation />
      
      {/* Banner - sirf home page pe show hota hai */}
      <Banner />
    </header>
  );
}

export default Header;
