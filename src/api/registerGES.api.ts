import axios from "axios";

// URL de l'API
// const API_URL = "https://tp1-django.onrender.com";
const API_URL = "http://localhost:8000";

export const getRegistreGesList = async (params?: any) => {
  return axios.get(`${API_URL}/app1/api/registre-ges/`, { params });
};

export const getRegistreGes = async (id: number) => {
  return axios.get(`${API_URL}/app1/api/registre-ges/${id}/`);
};