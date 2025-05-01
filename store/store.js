import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage", // LocalStorage key name
    }
  )
);

export default useAuthStore;
