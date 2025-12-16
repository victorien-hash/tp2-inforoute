import axios from "axios";

// const API_URL = "https://36e8cf4d4fea.ngrok-free.app";
const API_URL = "http://127.0.0.1:8000";

export const getBonTravailList = async () => {
  return axios.get(`${API_URL}/app1/api/bon-travail-aqueduc/`);
};

export const getBonTravailDetail = async (id: number) => {
  return axios.get(`${API_URL}/app1/api/bon-travail-aqueduc/${id}/`);
};
