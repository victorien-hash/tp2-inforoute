import axios from "axios";

// URL de l'API
//const API_URL = "https://tp1-django.onrender.com";
const API_URL = "http://localhost:8000";

export const getInterventionsPompiers = async (params?: any) => {
  return axios.get(`${API_URL}/app1/api/intervention-pompier/`, { params });
};

export const getInterventionPompierDetail = async (id: number) => {
  return axios.get(`${API_URL}/app1/api/intervention-pompier/${id}/`);
};