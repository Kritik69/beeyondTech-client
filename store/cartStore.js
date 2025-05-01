import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cart: null,
      setCart: (cart) => set({ cart }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useCartStore;
