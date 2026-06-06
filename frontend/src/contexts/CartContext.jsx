import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = React.useCallback(async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      const cartData = await cartAPI.get(sessionId);
      setCart(cartData);
    } catch (error) {
      logger.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const addToCart = React.useCallback(async (productId, selectedSize, quantity = 1) => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const updatedCart = await cartAPI.addItem(sessionId, {
        product_id: productId,
        selected_size: selectedSize,
        quantity,
      });
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      logger.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const updateCartItem = React.useCallback(async (productId, selectedSize, quantity) => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const updatedCart = await cartAPI.updateItem(sessionId, productId, selectedSize, quantity);
      setCart(updatedCart);
    } catch (error) {
      logger.error('Error updating cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const removeFromCart = React.useCallback(async (productId, selectedSize) => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const updatedCart = await cartAPI.removeItem(sessionId, productId, selectedSize);
      setCart(updatedCart);
    } catch (error) {
      logger.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const clearCart = React.useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      await cartAPI.clear(sessionId);
      setCart({ items: [], total: 0 });
    } catch (error) {
      logger.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Initialize session ID
  useEffect(() => {
    let storedSessionId = localStorage.getItem('session_id');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // Fetch cart when session ID is available
  useEffect(() => {
    if (sessionId) {
      fetchCart();
    }
  }, [sessionId, fetchCart]);

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Memoize context value to prevent unnecessary re-renders
  // Functions are stable due to useCallback, so we only depend on data
  const contextValue = React.useMemo(
    () => ({
      cart,
      loading,
      cartItemCount,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      fetchCart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, loading, cartItemCount]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
