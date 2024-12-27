import React from 'react';
import { CheckCircle, Package } from 'lucide-react';
import type { PickListItem } from '../../../types/inventory';

interface PickListProps {
  items: PickListItem[];
  onUpdateStatus: (itemId: string, status: PickListItem['status']) => Promise<void>;
}

export const PickList: React.FC<PickListProps> = ({ items, onUpdateStatus }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Pick List</h3>
        <span className="text-sm text-gray-500">
          {items.filter(i => i.status === 'picked').length} of {items.length} picked
        </span>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">{item.toy_id}</p>
                <p className="text-sm text-gray-500">
                  Location: {item.location} • Quantity: {item.quantity}
                </p>
              </div>
            </div>

            {item.status === 'pending' ? (
              <button
                onClick={() => onUpdateStatus(item.id, 'picked')}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Mark as Picked
              </button>
            ) : (
              <div className="flex items-center text-emerald-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                Picked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};