// src/services/authservice.js
import axios from "axios";

const authService = {
  login: async (email, password) => {
    const response = await axios.post(
      "http://localhost:3001/login",
      { email, password },
      { withCredentials: true }
    );
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  },
  getToken: () => localStorage.getItem("token"),
  isAuthenticated: () => !!localStorage.getItem("token"),
};

export default authService;