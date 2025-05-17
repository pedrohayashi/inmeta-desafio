import axios from "axios";

const api = axios.create({
  baseURL: "https://fieldsync.onrender.com",
  timeout: 10000,
});

export default api;
