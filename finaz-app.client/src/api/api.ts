import axios from "axios";

const SERVER_URL = process.env.SERVER_URL ?? "";

if (!SERVER_URL) {
  throw new Error("Please add your Server URL to environment variables.");
}

const API = (params?: object) => {
  const api = axios.create({
    params,
    timeout: 1000000,
    baseURL: SERVER_URL,
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
    },
  );

  return api;
};

export default API;
