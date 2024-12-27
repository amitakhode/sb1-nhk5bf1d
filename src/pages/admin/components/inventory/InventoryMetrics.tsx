import React from 'react';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';
import type { InventoryItem } from '../../../../types/inventory';

interface InventoryMetricsProps {
  inventory: InventoryItem[];
}

export const InventoryMetrics: React.FC<InventoryMetricsProps> = ({ inventory }) => {
  const metrics = {
    total: inventory.length,
    inStock: inventory.filter(i => i.status === 'in_stock').length,
    lowStock: inventory.filter(i => i.status === 'low_stock').length,
    outOfStock: inventory.filter(i => i.status === 'out_of_stock').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Package className="w-8 h-8 text-emerald-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-semibold">{metrics.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">In Stock</p>
            <p className="text-2xl font-semibold">{metrics.inStock}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">Low Stock</p>
            <p className="text-2xl font-semibold">{metrics.lowStock}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-500">Out of Stock</p>
            <p className="text-2xl font-semibold">{metrics.outOfStock}</p>
          </div>
        </div>
      </div>
    </div>
  );
};