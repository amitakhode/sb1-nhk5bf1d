import React from 'react';
import { useInventory } from '../../../hooks/useInventory';
import { InventoryList } from './components/InventoryList';
import { InventoryFilters } from './components/InventoryFilters';
import { InventoryMetrics } from './components/InventoryMetrics';
import { AddInventoryForm } from './components/AddInventoryForm';
import { Loader } from '../../../components/Loader';

export const InventoryPage: React.FC = () => {
  const { inventory, loading, error, updateQuantity } = useInventory();

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600">{error.message}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <AddInventoryForm onAdd={updateQuantity} />
      </div>
      
      <InventoryMetrics inventory={inventory || []} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <InventoryFilters />
        </div>
        <div className="lg:col-span-3">
          <InventoryList 
            items={inventory || []} 
            onUpdateQuantity={updateQuantity}
          />
        </div>
      </div>
    </div>
  );
};