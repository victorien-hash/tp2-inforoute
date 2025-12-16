import axios from "axios";

// URL de l'API
// const API_URL = "https://36e8cf4d4fea.ngrok-free.app";
const API_URL = "http://localhost:8000";

export const getVieDemocratique = async (params?: any) => {
  return axios.get(`${API_URL}/app1/api/vie-democratique/`, { params });
};

export const getVieDemocratiqueDetail = async (id: number) => {
  return axios.get(`${API_URL}/app1/api/vie-democratique/${id}/`);
};
