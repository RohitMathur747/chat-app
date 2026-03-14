import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      toast.error("Session expired. Please login again.");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  signup: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
};

export const userAPI = {
  getUser: () => api.get("/user"),
  updateUser: (data) => api.put("/user/profile", data),
  getUserById: (id) => api.get(`/user/${id}`),
};

export const chatAPI = {
  getChats: (id) => api.get(`/chats/${id}`),
  getChatById: (id) => api.get(`/chats/${id}`),
  search: (q) => api.get("/chats/search", { params: { q } }),
  add: (data) => api.post("/chats/add", data),
};

export const messageAPI = {
  getMessages: (chatId) => api.get(`/messages/${chatId}`),
  sendMessage: (chatId, data) => api.post(`/messages/${chatId}/send`, data),
};

export default api;
