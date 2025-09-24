// React hooks aur routing ke liye imports
import React, { useState, useEffect } from "react";
import { categories } from "../../constants/data"; // Categories data import karta hai
import { useParams, useNavigate } from "react-router-dom";
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

// UpdatePost component - ye blog post update karne ke liye form hai
const UpdatePost = ({ user }) => {
  const { postId } = useParams(); // URL se postId extract karta hai
  const navigate = useNavigate(); // Page navigation ke liye

  // State variables - form data aur UI state track karte hain
  const [post, setPost] = useState(initialPost);
  const [selectedImage, setSelectedImage] = useState(null); // Selected image file
  const [imagePreview, setImagePreview] = useState(null); // Image preview URL
  const [isSubmitting, setIsSubmitting] = useState(false); // Form submit state
  const [loading, setLoading] = useState(true); // Data loading state
  const [error, setError] = useState(null); // Error state

  // User authentication check - agar user login nahi hai to login page pe redirect
  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch existing post data - component mount hone pe existing post data fetch karta hai
  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) {
        setError('No post ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching post data for ID:', postId);
        
        // Get all posts and find the one with matching ID
        const response = await ApiService.getAllPosts();
        if (response?.isSuccess && response.data?.data) {
          const foundPost = response.data.data.find(p => p._id === postId);
          if (foundPost) {
            console.log('Found post:', foundPost);
            setPost({
              title: foundPost.title || '',
              description: foundPost.description || '',
              picture: foundPost.picture || '',
              username: foundPost.username || user?.name || '',
              categories: foundPost.categories || '',
              createdDate: foundPost.createdDate || new Date()
            });
            
            // Set image preview if picture exists
            if (foundPost.picture && foundPost.picture.trim() !== '') {
              setImagePreview(foundPost.picture);
            }
          } else {
            setError('Post not found');
          }
        } else {
          setError('Failed to fetch post data');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Error loading post data');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId, user]);

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
    // Existing image ko bhi clear kar deta hai
    setPost(prevPost => ({
      ...prevPost,
      picture: ''
    }));
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
      } else if (post.picture) {
        // Agar koi new image select nahi hai lekin existing picture hai to use karo
        console.log('Using existing image');
      } else {
        console.log('No image selected');
      }

      // Debug: FormData contents check karta hai
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Update post API call - abhi ke liye createPost use kar rahe hain, baad mein updatePost banayenge
      const response = await ApiService.createPost(formData);
      
      const endTime = Date.now();
      console.log(`API call took ${endTime - startTime}ms`); // Performance log
      
      // Success response handle karta hai
      if (response?.isSuccess) {
        alert("Post updated successfully!");
        navigate("/posts"); // Posts page pe redirect karta hai
      } else {
        alert(response?.msg || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      
      // Different error types handle karta hai
      if (error.code === 'ECONNABORTED') {
        alert("Request timed out. Please check your connection and try again.");
      } else if (error?.msg) {
        alert(error.msg);
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error updating post. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Loading state stop karta hai
    }
  };


  // Loading state - data fetch ho raha hai to spinner show karta hai
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">Loading post data...</p>
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
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Post</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/posts')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // JSX return - ye UI render karta hai
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header section - title aur user info */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Update Blog Post</h1>
            {user && (
              <div className="text-sm text-gray-600">
                <span className="text-gray-500">Updating as:</span>
                <span className="ml-2 font-medium text-indigo-600">{user.name}</span>
              </div>
            )}
          </div>
          
          {/* Main form - post creation form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
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

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              
              {!imagePreview && !post.picture ? (
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
                      src={imagePreview || post.picture}
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
                    {selectedImage ? (
                      <>
                        <p>Selected: {selectedImage?.name}</p>
                        <p>Size: {(selectedImage?.size / 1024 / 1024).toFixed(2)} MB</p>
                      </>
                    ) : (
                      <p>Current image</p>
                    )}
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
                     Updating...
                   </>
                 ) : (
                   'Update Post'
                 )}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;