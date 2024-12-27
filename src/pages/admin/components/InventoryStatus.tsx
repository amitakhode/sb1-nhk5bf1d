import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import type { InventoryItem } from '../../../types/inventory';

interface InventoryStatusProps {
  inventory: InventoryItem[];
}

export const InventoryStatus: React.FC<InventoryStatusProps> = ({ inventory }) => {
  const lowStockItems = inventory.filter(item => item.status === 'low_stock');
  const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">Inventory Status</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-4">
          <Package className="w-8 h-8 text-emerald-500" />
          <div>
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-semibold">{inventory.length}</p>
          </div>
        </div>

        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <div className="flex items-center space-x-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <div>
              <p className="text-sm text-gray-500">Attention Needed</p>
              <p className="text-sm">
                {lowStockItems.length} low stock, {outOfStockItems.length} out of stock
              </p>
            </div>
          </div>
        )}
      </div>

      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Inventory Alerts</h4>
          <div className="space-y-2">
            {[...outOfStockItems, ...lowStockItems].map(item => (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-2 rounded ${
                  item.status === 'out_of_stock' 
                    ? 'bg-red-50 text-red-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                <span>{item.toy_id}</span>
                <span className="text-sm">
                  {item.status === 'out_of_stock' 
                    ? 'Out of Stock'
                    : `Low Stock (${item.available_quantity} left)`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};