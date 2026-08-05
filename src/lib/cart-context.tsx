import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { formatEur } from "./catalog";

export type CartItem = {
  id: string;
  slug: string;
  type: "cours" | "ebook" | "patron" | "sur-mesure";
  titre: string;
  image: string;
  prixEur: number;
  quantite: number;
  options?: string;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantite">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalEur: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("honor_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignorer
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("honor_cart", JSON.stringify(newItems));
    } catch {
      // Ignorer
    }
  };

  const addItem = (newItem: Omit<CartItem, "quantite">) => {
    const existingIndex = items.findIndex((i) => i.id === newItem.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = items.map((item, index) =>
        index === existingIndex ? { ...item, quantite: item.quantite + 1 } : item
      );
    } else {
      updated = [...items, { ...newItem, quantite: 1 }];
    }

    saveCart(updated);
    setIsCartOpen(true);
    toast.success(`"${newItem.titre}" a été ajouté à votre panier !`, {
      description: `Total panier : ${formatEur(
        updated.reduce((sum, i) => sum + i.prixEur * i.quantite, 0)
      )}`,
      duration: 4000,
    });
  };

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    saveCart(updated);
    toast.info("Article retiré du panier.");
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = items
      .map((i) => {
        if (i.id === id) {
          const newQty = i.quantite + delta;
          return newQty > 0 ? { ...i, quantite: newQty } : null;
        }
        return i;
      })
      .filter(Boolean) as CartItem[];

    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalEur = items.reduce((sum, item) => sum + item.prixEur * item.quantite, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalEur,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
