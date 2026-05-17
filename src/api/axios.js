import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && !error.config?.url?.includes("/auth/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.warn("Acesso negado (403):", error.config?.url);
    }

    if (status >= 500) {
      console.error("Erro interno do servidor:", error.config?.url);
    }

    return Promise.reject(error);
  },
);

export default api;
