// React application entry point - yahan se app start hoti hai
import { StrictMode } from 'react' // Strict mode - development ke time extra checks karta hai
import { createRoot } from 'react-dom/client' // React 18 ka new root API
import './index.css' // Global CSS styles
import App from './App.jsx' // Main App component

// React app ko DOM mein mount karta hai
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* StrictMode - development ke time warnings deta hai */}
    <App />
  </StrictMode>,
)
