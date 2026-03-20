import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  volume?: string; // Optional for non-cylinders
  type: "purchase" | "exchange";
  price: number;
  quantity: number;
  image: string;
  productType?: 'cylinder' | 'accessory' | 'other'; // New field
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  deliveryType: "free" | "paid";
  setDeliveryType: (type: "free" | "paid") => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  discount: number;
  applyPromoCode: (code: string) => void;
  promoError: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load cart from localStorage on mount with safe parsing
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Validate structure
          if (!Array.isArray(parsed)) {
            console.warn('⚠️ Cart data is not an array, resetting');
            localStorage.removeItem('cart');
            return [];
          }
          // Validate each item has required fields
          const validItems = parsed.filter((item: any) => {
            return item && 
                   typeof item.id === 'string' &&
                   typeof item.name === 'string' &&
                   typeof item.price === 'number' &&
                   typeof item.quantity === 'number';
          });
          if (validItems.length !== parsed.length) {
            console.warn('⚠️ Some cart items are invalid, cleaning up');
            localStorage.setItem('cart', JSON.stringify(validItems));
          }
          return validItems;
        }
      } catch (error) {
        console.error('❌ Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    return [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"free" | "paid">("free");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((p) => !p), []);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    const safeQuantity = Math.max(1, quantity);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + safeQuantity } : i));
      }
      // Ensure productType is set (fallback for old items)
      const safeItem: CartItem = {
        ...item,
        quantity: safeQuantity,
        productType: item.productType || 'cylinder',
      };
      return [...prev, safeItem];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode("");
    setDiscount(0);
    setPromoError("");
  }, []);

  const applyPromoCode = useCallback((code: string) => {
    setPromoCode(code);
    setPromoError("");
    
    // Any code = not found, discount = 0
    if (code.trim()) {
      setPromoError("Промокод не найден");
      setDiscount(0);
    } else {
      setDiscount(0);
    }
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, isOpen, openCart, closeCart, toggleCart,
        addItem, removeItem, updateQuantity, clearCart,
        totalItems, totalPrice,
        deliveryType, setDeliveryType,
        promoCode, setPromoCode, discount, applyPromoCode, promoError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
