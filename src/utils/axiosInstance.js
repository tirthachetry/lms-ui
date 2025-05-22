import axios from 'axios';

// Utility function to get CSRF token from cookies
// Get CSRF token from cookies
const axiosInstance = axios.create({
  baseURL: 'https://labour-management-system.onrender.com',
  withCredentials: true // Send cookies (JSESSIONID, CSRF token)
});

export default axiosInstance;
