import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { UpdateInventoryQuantityParams } from '../../../../services/inventory/types';

interface AddInventoryFormProps {
  onAdd: (params: UpdateInventoryQuantityParams) => Promise<void>;
}

export const AddInventoryForm: React.FC<AddInventoryFormProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toyId, setToyId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAdd({
        toyId,
        quantityChange: quantity,
        reason: 'restock',
        notes: `Initial stock. Location: ${location}`
      });
      
      // Reset form
      setToyId('');
      setQuantity(0);
      setLocation('');
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to add inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Inventory
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Toy ID
            </label>
            <input
              type="text"
              value={toyId}
              onChange={(e) => setToyId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
              placeholder="e.g., Shelf A-1"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding...' : 'Add Inventory'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};