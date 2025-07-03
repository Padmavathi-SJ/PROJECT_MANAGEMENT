import axios from "axios";

// Create Axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_CLIENT_URL,
  withCredentials: true
});

instance.interceptors.response.use(
  (response) => {
    // Normalize string responses to object format
    if (typeof response.data === "string") {
      response.data = { message: response.data };
    }
    return response;
  },
  (error) => {
    // Handle string error responses
    if (error.response && typeof error.response.data === "string") {
      error.response.data = { message: error.response.data };
    }

    // Extract message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      "Something went wrong!";

    // Handle 401 errors (authentication issues)
    if (error.response && error.response.status === 401) {
      if (["TokenExpired", "TokenMissing", "Invalid token!"].includes(message)) {
        window.location.href = "/login";
      }
    }

    // Attach the clean message to the error object for frontend use
    error.extractedMessage = message;

    return Promise.reject(error);
  }
);

export default instance;
