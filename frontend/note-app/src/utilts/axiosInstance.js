import axios from "axios";
import { BASE_URL } from "./constance";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // ✅ this is all you need!
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(BASE_URL);
export default axiosInstance;
