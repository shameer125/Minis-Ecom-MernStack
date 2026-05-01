import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('minis_cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('minis_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, size = null, color = null) => {
    setCartItems(prev => {
      const key = `${product._id}-${size}-${color}`;
      const exists = prev.find(i => `${i._id}-${i.selectedSize}-${i.selectedColor}` === key);
      if (exists) {
        toast.success('Cart updated!');
        return prev.map(i =>
          `${i._id}-${i.selectedSize}-${i.selectedColor}` === key
            ? { ...i, qty: Math.min(i.qty + quantity, product.stock) }
            : i
        );
      }
      toast.success('Added to cart!');
      return [...prev, { ...product, qty: quantity, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCartItems(prev => prev.filter(i => !(i._id === id && i.selectedSize === size && i.selectedColor === color)));
    toast.success('Removed from cart');
  };

  const updateQty = (id, size, color, qty) => {
    if (qty < 1) return removeFromCart(id, size, color);
    setCartItems(prev => prev.map(i =>
      i._id === id && i.selectedSize === size && i.selectedColor === color
        ? { ...i, qty } : i
    ));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((a, i) => a + i.qty, 0);
  const cartTotal = cartItems.reduce((a, i) => a + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}
