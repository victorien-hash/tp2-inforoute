import axios from "axios";

// Global axios interceptor: ajoute le token depuis localStorage (si présent)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // selon le backend Django REST framework TokenAuthentication
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Token ${token}`;
  }
  return config;
});

export default axios;
