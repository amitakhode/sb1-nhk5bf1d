import React from 'react';
import { Shield } from 'lucide-react';
import { formatPrice } from '../../utils/format';

interface OrderSummaryProps {
  subtotal: number;
  totalDeposit: number;
  showDepositNote?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  subtotal, 
  totalDeposit, 
  showDepositNote = true 
}) => {
  const gst = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + gst + totalDeposit;

  return (
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
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            <span>Security Deposit</span>
          </div>
          <span>₹{formatPrice(totalDeposit)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{formatPrice(total)}</span>
          </div>
          {showDepositNote && (
            <p className="text-xs text-gray-500 mt-1">
              *Security deposit is refundable as per terms
            </p>
          )}
        </div>
      </div>
    </div>
  );
};