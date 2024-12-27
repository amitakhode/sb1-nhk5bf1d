import React from 'react';
import type { PaymentMethod } from '../../../../types/payment';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selected,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          id="upi"
          type="radio"
          checked={selected === 'upi'}
          onChange={() => onChange('upi')}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="upi" className="ml-3 block text-sm font-medium text-gray-700">
          UPI Payment
        </label>
      </div>

      <div className="flex items-center">
        <input
          id="cod"
          type="radio"
          checked={selected === 'cod'}
          onChange={() => onChange('cod')}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
          Cash on Delivery
        </label>
      </div>
    </div>
  );
};