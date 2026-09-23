// src/store/cartStore.ts
import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  priceUSD: number; // 46
  priceCOP: number; // 95000
  qty: number;
  image?: string;
};

export const COUNTRIES = [
  "United States",
  "Panamá",
  "Costa Rica",
  "El Salvador",
  "Guatemala",
  "República Dominicana",
  "Colombia",
] as const;

type CountryName = (typeof COUNTRIES)[number];

type CartState = {
  items: CartItem[];
  country: CountryName;
  currency: "USD" | "COP";
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void; // 🔹 nuevo
  clear: () => void;
  setCountry: (country: CountryName) => void;
  getItemCount: () => number;
  getTotal: () => { amount: number; currency: "USD" | "COP" };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  country: "Colombia",
  currency: "COP",

  addItem: (item) =>
    set((state) => {
      const found = state.items.find((i) => i.id === item.id);
      if (found) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, qty: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQty: (id, qty) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, qty) } : i
      ),
    })),

  clear: () => set({ items: [] }),

  setCountry: (country) =>
    set({
      country,
      currency: country === "Colombia" ? "COP" : "USD",
    }),

  getItemCount: () =>
    get().items.reduce((acc, it) => acc + (it.qty ?? 0), 0),

  getTotal: () => {
    const state = get();
    const currency = state.currency;
    if (currency === "COP") {
      const amountCOP = state.items.reduce(
        (acc, it) => acc + it.priceCOP * it.qty,
        0
      );
      return { amount: amountCOP, currency: "COP" };
    } else {
      const amountUSD = state.items.reduce(
        (acc, it) => acc + it.priceUSD * it.qty,
        0
      );
      return { amount: amountUSD, currency: "USD" };
    }
  },
}));
