import axios from "axios";

const SERVER_URL = process.env.SERVER_URL ?? "";

if (!SERVER_URL) {
  throw new Error("Please add your Server URL to environment variables.");
}

function getCookie(name: string) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Check if this cookie starts with the name we are looking for
      if (cookie.startsWith(name + '=')) {
          return cookie.substring((name.length + 1), cookie.length);
      }
  }
  return null; // If cookie not found
}

const API = (params?: object) => {
  const token = getCookie("JWT")

  const api = axios.create({
    params,
    timeout: 1000000,
    baseURL: SERVER_URL,
    headers: { Authorization: `Bearer ${token}` },
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
