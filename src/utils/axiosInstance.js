import axios from 'axios';

// Utility function to get CSRF token from cookies
// Get CSRF token from cookies
// Get CSRF token from cookies
const getCSRFToken = () => {
    const name = "JSESSIONID";  // Default name for CSRF token set by Spring Security
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        const token = parts.pop().split(';').shift();
        console.debug("✅ CSRF token found:", token);
        return token;
    }

    console.warn("⚠️ CSRF token not found in cookies.");
    return null;  // If no token found
};

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: "https://labour-management-system.onrender.com",  // Your backend URL
    withCredentials: true,  // Important for sending cookies (JSESSIONID, XSRF-TOKEN)
});

// Add interceptor to attach CSRF token
axiosInstance.interceptors.request.use(
    (config) => {
        const csrfToken = getCSRFToken();
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;
            console.debug("🔐 CSRF token set in request header.");
        } else {
            console.warn("⚠️ No CSRF token set in headers (token missing).");
        }

        console.debug("📤 Outgoing request config:", config);
        return config;
    },
    (error) => {
        console.error("❌ Axios request setup failed:", error);
        return Promise.reject(error);
    }
);


export default axiosInstance;
