import React, { useState } from 'react';
import type { UpdateInventoryQuantityParams } from '../../../../services/inventory/types';

interface InventoryUpdateFormProps {
  toyId: string;
  onUpdate: (params: UpdateInventoryQuantityParams) => Promise<void>;
}

export const InventoryUpdateForm: React.FC<InventoryUpdateFormProps> = ({ 
  toyId, 
  onUpdate 
}) => {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState<UpdateInventoryQuantityParams['reason']>('restock');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate({
        toyId,
        quantityChange: quantity,
        reason,
        notes: notes.trim() || undefined
      });
      
      // Reset form
      setQuantity(0);
      setNotes('');
    } catch (err) {
      console.error('Failed to update inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity Change
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reason
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value as UpdateInventoryQuantityParams['reason'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="restock">Restock</option>
          <option value="return">Return</option>
          <option value="damage">Damage</option>
          <option value="rental">Rental</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Updating...' : 'Update Inventory'}
      </button>
    </form>
  );
};