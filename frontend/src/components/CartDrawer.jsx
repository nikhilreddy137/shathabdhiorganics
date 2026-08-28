import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { cartAPI } from '../services/api';
import { Button } from './ui/button';
import { toast } from './ui/sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

const CartDrawer = ({ open, onClose }) => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleUpdateQuantity = async (productId, selectedSize, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(productId, selectedSize, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId, selectedSize) => {
    try {
      await removeFromCart(productId, selectedSize);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) return;
    setCheckingOut(true);
    try {
      const result = await cartAPI.createCheckout(sessionId);
      if (result.skipped_items?.length) {
        toast.warning(`${result.skipped_items.join(', ')} could not be added (not synced with Shopify yet).`);
      }
      window.open(result.checkout_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Checkout is not available yet. Please connect Shopify in the Manage Panel.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0" data-testid="cart-drawer">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-light" style={{ fontFamily: 'Instrument Serif, serif' }}>
                Shopping Cart
              </SheetTitle>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
          </SheetHeader>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {!cart || cart.items?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12" data-testid="cart-empty">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add some products to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.items.map((item, index) => (
                  <div key={`${item.product_id}-${item.selected_size}-${index}`} data-testid={`cart-item-${item.product_id}`} className="flex gap-4 pb-6 border-b border-gray-200">
                    <div className="w-24 h-24 flex-shrink-0 bg-cream2 rounded-xl">
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-normal text-gray-900" style={{ fontFamily: 'Instrument Serif, serif' }}>
                          {item.product_name}
                        </h3>
                        <button
                          onClick={() => handleRemoveItem(item.product_id, item.selected_size)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{item.selected_size}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 border border-cream3 rounded-full">
                          <button
                            onClick={() => handleUpdateQuantity(item.product_id, item.selected_size, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product_id, item.selected_size, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-light text-gray-900">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items?.length > 0 && (
            <div className="border-t border-cream3 px-6 py-6 bg-cream">
              <div className="flex justify-between mb-6">
                <span className="text-base font-normal text-gray-900">Subtotal</span>
                <span className="text-xl font-light" data-testid="cart-subtotal" style={{ fontFamily: 'Instrument Serif, serif' }}>
                  ₹{cart.total?.toFixed(2) || '0.00'}
                </span>
              </div>
              <Button 
                onClick={handleCheckout}
                disabled={checkingOut}
                data-testid="cart-checkout-btn"
                className="w-full bg-soil hover:bg-charcoal text-cream rounded-full py-6 text-sm uppercase tracking-wider font-medium"
              >
                {checkingOut ? 'Preparing Checkout...' : 'Checkout'}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Secure checkout powered by Shopify
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
