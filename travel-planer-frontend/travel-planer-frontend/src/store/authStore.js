// src/store/authStore.js
import { create } from "zustand";
import api from "../services/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  setUser: (user) => set({ user }),
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
      return user;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
  register: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/register", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
      return user;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
