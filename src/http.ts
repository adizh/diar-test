import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

import store from "./store";
const url = "http://176.126.164.230:8088";

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

http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      console.log("401 error detected, dispatching refreshToken");

      await store.dispatch("refreshToken");
    }
    return Promise.reject(error);
  },
);

export default http;
export { url as BaseUrl };
