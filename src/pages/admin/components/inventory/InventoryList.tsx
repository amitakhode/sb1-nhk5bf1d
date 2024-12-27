import React, { useState } from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { InventoryUpdateForm } from './InventoryUpdateForm';
import type { InventoryItem } from '../../../../types/inventory';
import type { UpdateInventoryQuantityParams } from '../../../../services/inventory/types';

interface InventoryListProps {
  inventory: InventoryItem[];
  onUpdateQuantity: (params: UpdateInventoryQuantityParams) => Promise<void>;
}

export const InventoryList: React.FC<InventoryListProps> = ({ 
  inventory,
  onUpdateQuantity
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
      {inventory.map((item) => (
        <div key={item.id} className="p-6 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <Package className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium">{item.toy_id}</h3>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Quantity</p>
                  <p className="font-medium">{item.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-500">Available</p>
                  <p className="font-medium">{item.available_quantity}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reserved</p>
                  <p className="font-medium">{item.reserved_quantity}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {item.status === 'low_stock' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Low Stock
                </span>
              )}
              <button
                onClick={() => setSelectedItem(selectedItem === item.toy_id ? null : item.toy_id)}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Update Quantity
              </button>
            </div>
          </div>

          {selectedItem === item.toy_id && (
            <div className="mt-4 border-t pt-4">
              <InventoryUpdateForm
                toyId={item.toy_id}
                onUpdate={onUpdateQuantity}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};