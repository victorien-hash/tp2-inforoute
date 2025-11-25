import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // exemple, change selon ton API

// Intercepteur pour ajouter le token aux requêtes
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const loginRequest = async (data: { username: string; password: string }) => {
  return axios.post(`${API_URL}/auth/login/`, data);
};

export const registerRequest = async (data: { 
  username: string; 
  password: string; 
  email: string;
  first_name: string;
  last_name: string;
}) => {
  return axios.post(`${API_URL}/auth/register/`, data);
};

export const updateUserProfile = async (
  id: number,
  data: {
    username?: string;
    password?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  }
) => {
  const payload = { ...data };
  if (!payload.password) delete (payload as any).password; // mot de passe facultatif
  return axios.put(`${API_URL}/auth/profile/${id}/`, payload);
};
