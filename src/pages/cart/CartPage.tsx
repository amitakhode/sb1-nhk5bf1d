import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatPrice } from '../../utils/format';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => 
    sum + (item.toy.pricePerDay * item.duration), 0
  );
  const totalDeposit = cart.reduce((sum, item) => 
    sum + item.toy.depositAmount, 0
  );
  const gst = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + gst + totalDeposit;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <ShoppingCart className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-600">Your cart is empty</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.toy.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex space-x-4">
                <img
                  src={item.toy.imageUrl}
                  alt={item.toy.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.toy.name}</h3>
                  <p className="text-sm text-gray-600">
                    Rental Duration: {item.duration} days
                  </p>
                  <p className="font-medium">
                    ₹{formatPrice(item.toy.pricePerDay * item.duration)}
                  </p>
                  <div className="mt-2 flex items-center text-blue-600">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      Refundable Deposit: ₹{formatPrice(item.toy.depositAmount)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.toy.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>GST (18%)</span>
              <span>₹{formatPrice(gst)}</span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Security Deposit</span>
              <span>₹{formatPrice(totalDeposit)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                *Security deposit is refundable as per terms
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-6 bg-yellow-600 text-white py-3 rounded-md hover:bg-yellow-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};