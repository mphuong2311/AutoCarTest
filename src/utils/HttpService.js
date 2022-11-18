import axios from "axios";

// Create an axios instance
const HttpService = axios.create({
  baseURL: "http://localhost:1221/v1",
  timeout: 2000, // request timeout
});

export default HttpService;
