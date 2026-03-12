import { useState, useEffect } from 'react';
import { fetchOrdersApi, checkoutApi } from '../services/api';

export const useOrders = (currentUser) => {
  const [orders, setOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // --- Fetch Orders Automatically When The Modal Opens ---
  useEffect(() => {
    if (currentUser && showOrderModal) {
      fetchOrdersApi(currentUser._id)
        .then(setOrders)
        .catch(console.error);
    }
  }, [currentUser, showOrderModal]);

  const handleCheckout = async (cartItems, clearLocalCart) => {
    if (!currentUser || cartItems.length === 0) return;
    
    try {
      // --- 1. Tell FastAPI To Convert The Cart To An Order In MongoDB ---
      await checkoutApi(currentUser._id);
      
      // --- 2. Empty The Frontend Cart Immediately So The User Sees It Vanish ---
      clearLocalCart(); 
      
      // --- 3. Silently Fetch The Updated Order List In The Background ---
      const updatedOrders = await fetchOrdersApi(currentUser._id);
      setOrders(updatedOrders);
      
      // --- 4. Give The User Success Feedback ---
      alert("Checkout successful! Your order has been placed.");
      
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to checkout. Please try again.");
    }
  };

  return { orders, showOrderModal, setShowOrderModal, handleCheckout };
};