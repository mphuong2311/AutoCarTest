import axios from "axios";

// Create an axios instance
const HttpService = axios.create({
  baseURL: "http://localhost:1221/v1",
  timeout: 2000, // request timeout
});

// Request interceptor
HttpService.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// Response interceptor
HttpService.interceptors.response.use(
  (response) => {
      return response;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default HttpService;
