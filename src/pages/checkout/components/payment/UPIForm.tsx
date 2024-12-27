import React, { useState } from 'react';
import { formatPrice } from '../../../../utils/format';

interface UPIFormProps {
  onSubmit: (data: { upiId: string }) => Promise<void>;
  loading: boolean;
  total: number;
}

export const UPIForm: React.FC<UPIFormProps> = ({ onSubmit, loading, total }) => {
  const [upiId, setUpiId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ upiId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Enter UPI ID (e.g., name@upi)"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
          required
          pattern="[a-zA-Z0-9._-]+@[a-zA-Z]{3,}"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
      </button>
    </form>
  );
};