import axios from "axios";

const SERVER_URL = process.env.SERVER_URL ?? "";

if (!SERVER_URL) {
  throw new Error("Please add your Server URL to environment variables.");
}

const API = (params?: object) => {
  const token = localStorage.getItem("token");

  const api = axios.create({
    params,
    timeout: 1000000,
    baseURL: SERVER_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  // api.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     if (error.response) {}
  //     return Promise.reject();
  //   },
  // );

  return api;
};

export default API;
