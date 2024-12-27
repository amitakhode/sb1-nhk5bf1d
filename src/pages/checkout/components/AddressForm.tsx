import React, { useState } from 'react';
import { useAddresses } from '../../../hooks/useAddresses';
import type { Database } from '../../../lib/supabase-types';

type Address = Database['public']['Tables']['addresses']['Row'];

interface AddressFormProps {
  onNext: () => void;
  onAddressSelect: (address: Address) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onNext, onAddressSelect }) => {
  const { addresses, loading, error, addAddress } = useAddresses();
  const [showNewForm, setShowNewForm] = useState(!addresses.length);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate phone number
      if (!/^\d{10}$/.test(formData.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Validate pincode
      if (!/^\d{6}$/.test(formData.pincode)) {
        throw new Error('Please enter a valid 6-digit pincode');
      }

      const newAddress = await addAddress(formData);
      onAddressSelect(newAddress);
      onNext();
    } catch (err) {
      console.error('Failed to add address:', err);
      alert(err instanceof Error ? err.message : 'Failed to add address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    onAddressSelect(address);
    onNext();
  };

  if (loading) return <div className="py-4 text-center">Loading addresses...</div>;
  if (error) return <div className="py-4 text-center text-red-600">Error loading addresses: {error.message}</div>;

  return (
    <div className="space-y-6">
      {!showNewForm && addresses.length > 0 && (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border rounded-lg p-4 cursor-pointer hover:border-yellow-500"
              onClick={() => handleSelectAddress(address)}
            >
              <p className="font-medium">{address.name}</p>
              <p className="text-sm text-gray-600">{address.phone}</p>
              <p className="text-sm text-gray-600">
                {address.address_line1}
                {address.address_line2 && `, ${address.address_line2}`}
              </p>
              <p className="text-sm text-gray-600">
                {address.city}, {address.state} - {address.pincode}
              </p>
              {address.is_default && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  Default Address
                </span>
              )}
            </div>
          ))}
          <button
            onClick={() => setShowNewForm(true)}
            className="w-full py-2 text-yellow-600 hover:text-yellow-700"
          >
            + Add New Address
          </button>
        </div>
      )}

      {showNewForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full border border-gray-300 rounded-r-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
            <input
              type="text"
              required
              value={formData.address_line1}
              onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
            <input
              type="text"
              value={formData.address_line2}
              onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
                pattern="[0-9]{6}"
                maxLength={6}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
              Set as default address
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};