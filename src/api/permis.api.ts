import axios from "axios";

const API_URL = "http://localhost:8000";

export const getPermisAnimal = async (id: number) => {
  return axios.get(`${API_URL}/app1/api/permis-animals/${id}/`);
};