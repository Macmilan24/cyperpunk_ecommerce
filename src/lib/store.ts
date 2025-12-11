import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // This can be productId OR variantId
  productId?: string; // The parent product ID
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  variant?: {
    id?: string;
    size: string;
    color: string;
  };
}

interface StoreState {
  items: CartItem[];
  wishlist: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
  addToWishlist: (item: CartItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useCartStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      addToWishlist: (item) => {
        const currentWishlist = get().wishlist;
        if (!currentWishlist.find((i) => i.id === item.id)) {
          set({ wishlist: [...currentWishlist, item] });
        }
      },
      removeFromWishlist: (id) =>
        set({ wishlist: get().wishlist.filter((i) => i.id !== id) }),
      isInWishlist: (id) => !!get().wishlist.find((i) => i.id === id),
    }),
    {
      name: "store-storage",
    }
  )
);
