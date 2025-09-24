// React hooks aur navigation ke liye imports
import React, { useState } from "react";
import blog from "../../assets/blog.svg";
import ApiService from "../../service/api"; // API calls ke liye service
import { useNavigate } from "react-router-dom";

// Login component - ye user ko login/signup karne mein help karta hai
const Login = ({ isAuthenticated, setIsAuthenticated, setUser }) => {
  const navigate = useNavigate(); // Page navigation ke liye
  
  // State variables - ye component ki current state ko track karte hain
  const [state, setState] = useState("login"); // "login" ya "signup" mode
  const [data, setData] = useState({
    name: "", // User ka naam (signup ke time)
    email: "", // User ka email
    password: "", // User ka password
  });
  const [loading, setLoading] = useState(false); // Loading state - API call chal rahi hai ya nahi

  // Form input change handle karne ke liye function
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Form submit handle karne ke liye function - ye API call karta hai
  const handleSubmit = async (e) => {
    e.preventDefault(); // Default form submission rok deta hai
    setLoading(true); // Loading start karta hai
    console.log("Form submitted:", data);

    try {
      let response;
      
      // Check karta hai ki signup hai ya login
      if (state === "signup") {
        // Signup API call - naya user banata hai
        response = await ApiService.userSignup(data);
        console.log("Signup response:", response);
      } else {
        // Login ke liye sirf email aur password bhejte hain
        const loginData = {
          email: data.email,
          password: data.password
        };
        // Login API call - existing user ko authenticate karta hai
        response = await ApiService.userLogin(loginData);
        console.log("Login response:", response);
      }

      // Agar API call successful hai
      if (response?.isSuccess) {
        alert(`${state === "login" ? "Login" : "Signup"} successful!`);
        
        // User ki details store karta hai app mein
        if (response.data) {
          setUser({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email
          });
        }
        
        // Form clear kar deta hai successful login/signup ke baad
        setData({ name: "", email: "", password: "" });
        setIsAuthenticated(true); // User ko authenticated mark karta hai
        navigate('/'); // Home page pe redirect karta hai
      } else {
        // Error handle karta hai (jaise 401, 409, etc.)
        alert(response?.msg || "Something went wrong!");
      }
    } catch (err) {
      console.error("API error:", err);
      // Server se aaya hua actual error message show karta hai
      alert(err?.msg || "Server error. Please try again.");
    } finally {
      setLoading(false); // Loading stop karta hai
    }
  };

  // JSX return - ye UI render karta hai
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
        onSubmit={handleSubmit}
      >
        {/* Logo aur heading */}
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          <img src={blog} alt="login" className="mx-auto mb-4 h-16" />
        </h1>

        {/* Name field - sirf signup mode mein show hota hai */}
        {state === "signup" && (
          <div className="flex items-center w-full mt-4 bg-white border border-zinc-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <input
              type="text"
              placeholder="UserName"
              className="bg-transparent text-zinc-600 outline-none text-sm w-full h-full"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>
        )}

        {/* Email input field */}
        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="email"
            placeholder="Email id"
            className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        {/* Password input field */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        {/* Submit button - loading state ke saath */}
        <button
          type="submit"
          disabled={loading} // Loading ke time button disable ho jata hai
          className={`mt-2 w-full h-11 rounded-full text-white transition-opacity ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:opacity-90"
          }`}
        >
          {loading ? "Please wait..." : state === "login" ? "Login" : "Sign Up"}
        </button>

        {/* Toggle between login aur signup */}
        <p className="text-gray-500 text-sm mt-3 mb-11">
          {state === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <span
            className="text-indigo-500 cursor-pointer"
            onClick={() => setState(state === "login" ? "signup" : "login")}
          >
            {state === "login" ? "Sign Up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
