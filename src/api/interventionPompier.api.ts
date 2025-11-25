import axios from "axios";

const API_URL = "http://localhost:8000";

export const getInterventionsPompiers = async (params?: any) => {
  return axios.get(`${API_URL}/app1/api/intervention-pompier/`, { params });
};

export const getInterventionPompierDetail = async (id: number) => {
  return axios.get(`${API_URL}/app1/api/intervention-pompier/${id}/`);
};