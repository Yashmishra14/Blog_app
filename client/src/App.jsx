// React aur routing ke liye necessary imports
import { useState } from 'react' // State management ke liye
import './App.css' // Styling ke liye
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom' // Page routing ke liye
import Login from './components/account/login' // Login page component
import Home from './components/home/home' // Home page component
import Header from './components/header/header' // Navigation header component
import CreatePost from './components/create/CreatePost' // New post create karne ke liye
import Post from './components/post/post' // All posts display karne ke liye
import UpdatePost from './components/create/update' // Post update karne ke liye
import DeletePost from './components/create/Delete' // Post delete karne ke liye
import AIDashboard from './components/ai/AIDashboard' // AI Dashboard component

// PrivateRoute component - ye check karta hai ki user login hai ya nahi
// Agar login hai to header aur content show karta hai, nahi to login page pe redirect kar deta hai
const PrivateRoute = ({ isAuthenticated, ...props }) => {
  return isAuthenticated ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <Navigate replace to="/login" />
  );
}

// Main App component - yahan pe sab kuch start hota hai
function App() {
  // State variables - ye app ke current state ko track karte hain
  const [isAuthenticated, setIsAuthenticated] = useState(false); // User login hai ya nahi
  const [user, setUser] = useState(null); // User ki details store karta hai

  return (
    <BrowserRouter>
      <div>
        {/* Routes - yahan pe different pages ke routes define hain */}
        <Routes>
          {/* Login page route - ye public hai, koi bhi access kar sakta hai */}
          <Route 
            path="/login" 
            element={
              <Login 
                isAuthenticated={isAuthenticated} 
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              /> 
            } 
          />
          {/* Home page route - ye private hai, sirf login users access kar sakte hain */}
          <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/" element={<Home />} />
          </Route>
          {/* Create post page route - ye bhi private hai */}
          <Route path="/create" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/create" element={<CreatePost user={user} />} />
          </Route>
          {/* View posts page route - ye bhi private hai */}
          <Route path="/posts" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/posts" element={<Post />} />
          </Route>
          {/* Update post page route - ye bhi private hai */}
          <Route path="/UpdatePost/:postId" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/UpdatePost/:postId" element={<UpdatePost user={user} />} />
          </Route>
          {/* Delete post page route - ye bhi private hai */}
          <Route path="/DeletePost" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/DeletePost" element={<DeletePost />} />
          </Route>
          {/* AI Dashboard route - AI features ke liye */}
          <Route path="/ai-dashboard" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/ai-dashboard" element={<AIDashboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
