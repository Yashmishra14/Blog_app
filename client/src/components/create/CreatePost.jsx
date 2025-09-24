// React hooks aur routing ke liye imports
import React, { useState, useEffect } from "react";
import { categories } from "../../constants/data"; // Categories data import karta hai
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/api"; // API calls ke liye service

// Initial post data - form ke default values
const initialPost = {
  title: '', // Post ka title
  description: '', // Post ka description
  picture: '', // Post ki image
  username: '', // User ka naam
  categories: '', // Post ki category
  createdDate: new Date() // Creation date
}

// CreatePost component - ye blog post create karne ke liye form hai
const CreatePost = ({ user }) => {
  const location = useLocation(); // Current page location get karta hai
  const navigate = useNavigate(); // Page navigation ke liye
  const queryparams = new URLSearchParams(location.search); // URL parameters get karta hai
  const selectedCategory = queryparams.get("Category") || ""; // URL se category get karta hai

  // State variables - form data aur UI state track karte hain
  const [post, setPost] = useState({
    ...initialPost,
    username: user?.name || '', // User ka naam pre-fill karta hai
    categories: selectedCategory // URL se aaya hua category pre-fill karta hai
  });
  const [selectedImage, setSelectedImage] = useState(null); // Selected image file
  const [imagePreview, setImagePreview] = useState(null); // Image preview URL
  const [isSubmitting, setIsSubmitting] = useState(false); // Form submit state

  // User authentication check - agar user login nahi hai to login page pe redirect
  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, navigate]);

  // Username update - jab user prop change hota hai to username update karta hai
  useEffect(() => {
    console.log('User prop received:', user);
    if (user?.name) {
      setPost(prevPost => ({
        ...prevPost,
        username: user.name
      }));
    } else {
      // Agar user nahi hai to username empty rahega
      console.log('No user found, username will be empty');
    }
  }, [user]);

  // Form input change handle karne ke liye function
  const handleChange = (e) => {
    setPost({...post, [e.target.name]: e.target.value})
  }

  // Image file select karne ke liye function
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Selected file store karta hai
      const reader = new FileReader(); // File reader create karta hai
      reader.onload = (e) => {
        setImagePreview(e.target.result); // Image preview set karta hai
      };
      reader.readAsDataURL(file); // File ko base64 mein convert karta hai
    }
  };

  // Selected image remove karne ke liye function
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Form submit handle karne ke liye main function - API call karta hai
  const handleSubmit = async (e) => {
    e.preventDefault(); // Default form submission rok deta hai

    // Double submission prevent karta hai
    if (isSubmitting) return;

    // Debug: Current post state log karta hai
    console.log('Current post state:', post);
    
    // Required fields validate karta hai before sending
    const missingFields = [];
    if (!post.title) missingFields.push('Title');
    if (!post.description) missingFields.push('Description');
    if (!post.categories) missingFields.push('Categories');
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true); // Loading state start karta hai
    const startTime = Date.now(); // Performance tracking ke liye

    try {
      // FormData create karta hai - multipart form data ke liye
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("description", post.description);
      formData.append("categories", post.categories);
      
      // Username sirf tab add karta hai jab exist karta hai
      if (post.username) {
        formData.append("username", post.username);
      }

      // Image sirf tab add karta hai jab selected hai
      if (selectedImage) {
        formData.append("image", selectedImage);
        console.log('Image added to FormData:', {
          name: selectedImage.name,
          size: selectedImage.size,
          type: selectedImage.type
        });
      } else {
        console.log('No image selected');
      }

      // Debug: FormData contents check karta hai
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Form data prepared for submission - API call karta hai
      const response = await ApiService.createPost(formData);
      
      const endTime = Date.now();
      console.log(`API call took ${endTime - startTime}ms`); // Performance log
      
      // Success response handle karta hai
      if (response?.isSuccess) {
        alert("Post created successfully!");
        navigate("/"); // Home page pe redirect karta hai
      } else {
        alert(response?.msg || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      
      // Different error types handle karta hai
      if (error.code === 'ECONNABORTED') {
        alert("Request timed out. Please check your connection and try again.");
      } else if (error?.msg) {
        alert(error.msg);
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error creating post. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Loading state stop karta hai
    }
  };


  // JSX return - ye UI render karta hai
  return (
    
    
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header section - title aur user info */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Create New Blog Post</h1>
            {user && (
              <div className="text-sm text-gray-600">
                <span className="text-gray-500">Posting as:</span>
                <span className="ml-2 font-medium text-indigo-600">{user.name}</span>
              </div>
            )}
          </div>
          
          {/* Main form - post creation form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
           
    
            

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option>Select a category</option>
                <option>Music</option>
                <option>Movies</option>
                <option>Sport</option>
                <option>Tech</option>
                <option>Fashion</option>
                
              </select>
            </div> */}
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="categories"
                value={post.categories}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.type}>
                    {cat.type}
                  </option>
                ))}
              </select>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title
              </label>
              <input
                 type="text"
                name="title"
                value={post.title}
                 onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your post title..."
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-indigo-600 hover:text-indigo-500 font-medium">
                          Click to upload
                        </span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Selected: {selectedImage?.name}</p>
                    <p>Size: {(selectedImage?.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
               <textarea
                 rows={10}
                 name="description"
                 value={post.description}
                 onChange={handleChange}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"   
                 placeholder="Write your blog post content here..."
               ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Draft
              </button>
               <button
                 type="submit"
                 disabled={isSubmitting}
                 className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
               >
                 {isSubmitting ? (
                   <>
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Publishing...
                   </>
                 ) : (
                   'Publish Post'
                 )}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;