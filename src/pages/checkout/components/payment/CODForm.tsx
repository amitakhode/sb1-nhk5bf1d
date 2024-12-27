import React from 'react';
import { formatPrice } from '../../../../utils/format';

interface CODFormProps {
  onSubmit: (data: {}) => Promise<void>;
  loading: boolean;
  total: number;
}

export const CODForm: React.FC<CODFormProps> = ({ onSubmit, loading, total }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">
        Pay with cash when your order is delivered. A delivery fee may apply.
      </p>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Processing...' : `Place Order (${formatPrice(total)})`}
      </button>
    </form>
  );
};