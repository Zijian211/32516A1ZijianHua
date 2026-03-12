import { useState, useEffect } from 'react';
import { addToCartApi, getCartApi, updateCartQuantityApi, removeCartItemApi } from '../services/api';

export const useCart = (currentUser, setShowAuthModal, setToastMessage) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Sync Cart with Database on Login ---
  useEffect(() => {
    if (currentUser) {
      getCartApi(currentUser._id)
        .then(data => setCartItems(data))
        .catch(console.error);
    } else {
      setCartItems([]);
    }
  }, [currentUser]);
  
  // --- Cart Operations ---
  const handleAddToCart = async (product) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return; 
    }

    try {
      const itemData = {
        user_id: currentUser._id,
        product_id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      };

      await addToCartApi(itemData);

      // --- Fetch Latest Cart To Ensure Perfect Sync ---
      const updatedCart = await getCartApi(currentUser._id);
      setCartItems(updatedCart);
      
      // --- Feedback Loop: Show Toast Notification On Add To Cart ---
      setToastMessage(`${product.name} added to cart!`);
      setTimeout(() => setToastMessage(null), 3000);

    } catch (err) {
      console.error("Cart error:", err);
    }
  };
  
  // --- Update Quantity With Instant UI Feedback ---
  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartQuantityApi(currentUser._id, productId, newQty);
      // --- Local State For Instant UI Feedback ---
      setCartItems(prev => prev.map(item => item.product_id === productId ? { ...item, quantity: newQty } : item));
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };
  
  // --- Remove Item With Instant UI Feedback ---
  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItemApi(currentUser._id, productId);
      setCartItems(prev => prev.filter(item => item.product_id !== productId));
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };
  
  // --- Clear Cart Function To Be Used After Successful Checkout ---
  const clearCart = () => setCartItems([]);
  
  // --- Total Items In Cart For Displaying On Cart Icon ---
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { cartItems, isCartOpen, setIsCartOpen, handleAddToCart, handleUpdateQuantity, handleRemoveItem, clearCart, totalCartItems };
};