import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

export const authStore = create((set) => ({
  user: null,
  token: null,

  login: async (user, token) => {
    await SecureStore.setItemAsync("token", token);
    set({ user, token });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    set({ user: null, token: null });
  },
}));
