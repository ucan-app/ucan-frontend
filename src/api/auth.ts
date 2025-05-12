import axios from "axios";
import { User } from "../types";

const API_BASE_URL = "http://localhost:8080/api/auth"; // Update with your backend URL

export const login = async (username: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
  return response.data;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const response = await axios.get(`${API_BASE_URL}/current-user`, { withCredentials: true });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
};