import api from "./api";

const authService = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: () => localStorage.getItem("token"),
  getUser: () => JSON.parse(localStorage.getItem("user") || "null"),
  
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },
};

export default authService;