import axios from "axios";

/**
 * Axios instance
 * - Uses relative baseURL so it works in:
 *   dev  → http://localhost:5173 (via Vite proxy)
 *   prod → http://localhost:3001/admin
 */
const api = axios.create({
  baseURL: "/api/admin",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      // redirect respecting /admin base
      window.location.href = `${import.meta.env.BASE_URL}login`;
    }
    return Promise.reject(error);
  }
);

/* =========================
   AUTH APIs
========================= */
export const loginAdmin = async (email, password) => {
  const res = await api.post("/login", { email, password });
  return res.data;
};

export const registerAdmin = async (data) => {
  const res = await api.post("/register", data);
  return res.data;
};

export const logoutAdmin = async () => {
  const res = await api.post("/logout");
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

/* =========================
   DASHBOARD APIs
========================= */
export const getDashboardStats = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};

/* =========================
   PRODUCT APIs
========================= */
export const getProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getProduct = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

/* =========================
   DEFAULT EXPORT
========================= */
export default api;
