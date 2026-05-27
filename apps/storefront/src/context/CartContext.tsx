import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// تعريف بنية العنصر داخل السلة
export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  sku: string;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. دالة إضافة منتج للسلة مع فحص المخزن المتاح
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product._id);
      
      if (existingItem) {
        // إذا كان المنتج موجوداً مسبقاً، نتأكد ألا نتجاوز المخزن المتاح سحابياً
        if (existingItem.quantity >= product.stock) {
          alert("عذراً، لقد تجاوزت الكمية المتوفرة في المستودع!");
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      // إضافة عنصر جديد لأول مرة
      return [
        ...prevCart,
        {
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.images[0] || "",
          sku: product.sku,
          quantity: 1,
          maxStock: product.stock,
        },
      ];
    });
  };

  // 2. حذف عنصر بالكامل من السلة
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // 3. تحديث الكمية (زيادة أو نقصان بالـ Delta)
  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty > item.maxStock) {
              alert("لا توجد كمية كافية بالمخزن!");
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0) // لو نزلت الكمية عن 1 يحذف تلقائياً
    );
  };

  const clearCart = () => setCart([]);

  // حساب الحقول الإجمالية تلقائياً حياً
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};