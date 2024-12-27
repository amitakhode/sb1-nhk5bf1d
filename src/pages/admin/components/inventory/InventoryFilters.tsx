import React from 'react';
import { Filter } from 'lucide-react';

export const InventoryFilters: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex items-center space-x-2 text-gray-700">
        <Filter className="w-5 h-5" />
        <h2 className="font-medium">Filters</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="quantity">Quantity</option>
            <option value="name">Name</option>
            <option value="location">Location</option>
          </select>
        </div>
      </div>
    </div>
  );
};