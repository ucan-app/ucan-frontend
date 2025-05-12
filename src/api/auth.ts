import axios from "axios";
import { User } from "../types";

const API_BASE_URL = "http://127.0.0.1:8080/api/auth"; // Update with your backend URL

export const login = async (username: string, password: string): Promise<User> => {
  const response = await axios.post("http://127.0.0.1:8080/login", new URLSearchParams({ username, password }), { withCredentials: true });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
};

export const register = async (username: string, email: string, password: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/register`, { username, email, password }, { withCredentials: true });
};