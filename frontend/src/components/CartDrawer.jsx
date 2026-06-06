import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

const CartDrawer = ({ open, onClose }) => {
  const { cart, updateCartItem, removeFromCart } = useCart();

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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
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
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add some products to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.items.map((item, index) => (
                  <div key={`${item.product_id}-${item.selected_size}-${index}`} className="flex gap-4 pb-6 border-b border-gray-200">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded">
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-normal text-gray-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
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
                        <div className="flex items-center gap-3 border border-gray-300 rounded-none">
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
            <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
              <div className="flex justify-between mb-6">
                <span className="text-base font-normal text-gray-900">Subtotal</span>
                <span className="text-xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  ₹{cart.total?.toFixed(2) || '0.00'}
                </span>
              </div>
              <Button 
                className="w-full bg-gray-900 hover:bg-black text-white rounded-none py-6 text-sm uppercase tracking-wider font-normal"
              >
                Checkout
              </Button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Shipping calculated at checkout
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
