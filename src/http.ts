// http.js
import axios, { AxiosInstance, AxiosResponse } from "axios";

const url = "http://20.55.72.226:8080";

const http: AxiosInstance = axios.create({
  baseURL: url,
});

const token = localStorage.getItem("accessToken");

http.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use((response: AxiosResponse) => {
  return response;
});

export default http;
export { url as BaseUrl };

// const httpBasic = axios.create({
//   baseURL: url,
// });

// httpBasic.interceptors.request.use((config) => {
//   return config;
// });

// httpBasic.interceptors.response.use((response: AxiosResponse) => {
//   return response;
// });

// export { httpBasic };
