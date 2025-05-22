import axios from 'axios';

// Utility function to get CSRF token from cookies
const getCSRFToken = () => {
    const name = "XSRF-TOKEN";  // Default name for CSRF token set by Spring Security
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;  // If no token found, return null
};

// Create an Axios instance to centralize request handling
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",  // Your Spring Boot API base URL
    withCredentials: true,  // Include cookies with requests (important for CSRF tokens)
});

// Add request interceptor to inject CSRF token for state-changing requests
axiosInstance.interceptors.request.use(
    (config) => {
        const csrfToken = getCSRFToken();  // Get the CSRF token
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;  // Set CSRF token in request header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
