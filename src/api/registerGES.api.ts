import axios from "axios";

const API_URL = "http://localhost:8000";

export const getRegistreGesList = async (params?: any) => {
  return axios.get(`${API_URL}/app1/api/registre-ges/`, { params });
};

export const getRegistreGes = async (id: number) => {
  return axios.get(`${API_URL}/app1/api/registre-ges/${id}/`);
};