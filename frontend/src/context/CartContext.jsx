import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const incrementCart = () => {
    setCartCount(prev => prev + 1);
  };

  const decrementCart = () => {
    setCartCount(prev => Math.max(0, prev - 1));
  };

  const resetCart = () => {
    setCartCount(0);
  };

  const value = {
    cartCount,
    updateCartCount,
    incrementCart,
    decrementCart,
    resetCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};