import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // withCredentials tells the browser to include/accept credentials in cross-origin requests
});

const register = async ({ username, email, password }) => {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
};

const login = async ({ email, password }) => {
    const response = await api.post(`/login`, { email, password });
    return response.data;
};

const logout = async () => {
    const response = await api.get(`/logout`);
    return response.data;
};

const getMe = async () => {
    const response = await api.get(`/get-me`);
    return response.data;
};

export { register, login, logout, getMe };
