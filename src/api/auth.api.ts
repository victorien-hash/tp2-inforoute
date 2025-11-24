import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // exemple, change selon ton API

export const loginRequest = async (data: { username: string; password: string }) => {
  return axios.post(`${API_URL}/auth/login/`, data);
};

export const registerRequest = async (data: { email: string; password: string; username: string }) => {
  return axios.post(`${API_URL}/auth/register/`, data);
};
