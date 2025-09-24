// API service - server se communication handle karta hai
import axios from "axios";
import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from "../constants/config";

// Axios instance create karta hai - base configuration
const API = axios.create({
  baseURL: "http://localhost:8000", // Server ka base URL
  timeout: 10000, // 10 seconds timeout
  // Default headers removed - individual requests mein set karenge
});

// Request interceptor - har request pe apply hota hai
API.interceptors.request.use(
  function (config) {
    return config; // Request ko as-is pass karta hai
  },
  function (error) {
    return Promise.reject(error); // Error handle karta hai
  }
);

// Response interceptor - har response pe apply hota hai
API.interceptors.response.use(
  function (response) {
    return processResponse(response); // Success response process karta hai
  },
  function (error) {
    return processError(error); // Error response process karta hai
  }
);

// Success response process karta hai
const processResponse = (response) => {
  if (response?.status === 200 || response?.status === 201) {
    return { data: response.data, isSuccess: true }; // Success response format
  } else {
    return {
      isFailure: true,
      status: response?.status,
      msg: response?.data?.message || response?.msg,
      code: response?.code,
    };
  }
};

// Error response process karta hai
const processError = (error) => {
  if (error.response) {
    // Server se aaya hua error message extract karta hai
    const serverMessage = error.response?.data?.message || API_NOTIFICATION_MESSAGES.requestFailure.message;
    return {
      isFailure: true,
      msg: serverMessage,
      code: error.response?.status,
    };
  } else if (error.request) {
    // Network error handle karta hai
    return {
      isFailure: true,
      msg: API_NOTIFICATION_MESSAGES.requestFailure.message,
    };
  } else {
    // Generic error handle karta hai
    return {
      isFailure: true,
      msg: API_NOTIFICATION_MESSAGES.networkError.message,
    };
  }
};

// API Service wrapper - dynamic API methods create karta hai
const ApiService = {};

// SERVICE_URLS se dynamic methods create karta hai
for (const [key, value] of Object.entries(SERVICE_URLS)) {
  ApiService[key] = (body) => {
    // createPost ke liye special handling - multipart form data
    if (key === 'createPost') {
      // FormData ke liye Content-Type automatically set hota hai
      return API({
        method: value.method,
        url: value.url,
        data: body
        // Headers nahi set karte - axios automatically handle karta hai FormData ke liye
      });
    }
    
    // getAllPosts ke liye special handling - GET request without body
    if (key === 'getAllPosts') {
      return API({
        method: value.method,
        url: value.url,
      });
    }
    
    // deletePost ke liye special handling - DELETE request with postId in URL
    if (key === 'deletePost') {
      return API({
        method: value.method,
        url: `${value.url}/${body.postId}`, // postId URL mein append karta hai
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // AI Vlog Generation methods - special handling for AI requests
    if (key === 'generateVlogScript' || key === 'generateVlogIdeas' || key === 'generateThumbnailIdeas') {
      return API({
        method: value.method,
        url: value.url,
        data: body,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Default API call - normal requests ke liye JSON content type
    return API({
      method: value.method,
      url: value.url,
      data: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };
}

export default ApiService;
