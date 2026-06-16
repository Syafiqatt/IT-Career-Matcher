import axios from "axios";

// Networking calls memakai Axios. baseURL "/api" diproxy Vite ke backend Express.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 20000,
});

// Sisipkan JWT (jika ada) ke setiap request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ----------------------------- Auth ----------------------------- */
export const apiRegister = (payload) =>
  api.post("/auth/register", payload).then((r) => r.data.data);

export const apiLogin = (payload) =>
  api.post("/auth/login", payload).then((r) => r.data.data);

export const apiMe = () => api.get("/auth/me").then((r) => r.data.data.user);

/* ------------------------- Recommendations ---------------------- */
export const getOptions = () => api.get("/options").then((r) => r.data.data);

export const createRecommendation = (profile) =>
  api.post("/recommendations", profile).then((r) => r.data.data);

export const listHistory = (params = {}) =>
  api.get("/recommendations", { params }).then((r) => r.data);

export const deleteHistory = (id) =>
  api.delete(`/recommendations/${id}`).then((r) => r.data);

export default api;
