import axios, { HttpStatusCode } from "axios";
import { API_URL } from "../constants/api";

const api = axios.create({
  baseURL: API_URL.DEV,
  timeout: 3000
})

// api.interceptors.response.use(
//   (response) => response, // handle service code
//   (error) => {
//     if (error.response.status == HttpStatusCode.Unauthorized) {
//       // handle unauthorized
//     }
//     return Promise.reject(error)
//   }
// )

export default api;