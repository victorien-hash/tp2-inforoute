import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getVieDemocratique = async () => {
  return axios.get(`${API_URL}/app1/api/vie-democratique/`);
};
