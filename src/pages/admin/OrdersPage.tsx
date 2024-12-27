import React, { useState, useEffect } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { OrderList } from './components/OrderList';
import { OrderFilters } from './components/OrderFilters';
import { OrderMetrics } from './components/OrderMetrics';
import { InventoryStatus } from './components/InventoryStatus';
import { Loader } from '../../components/Loader';
import { getInventoryLevels } from '../../services/inventory';
import type { OrderStatus, OrderFilter } from '../../types/orders';
import type { InventoryItem } from '../../types/inventory';

export const OrdersPage: React.FC = () => {
  const [filters, setFilters] = useState<OrderFilter>({
    status: 'all',
    dateRange: 'today',
    priority: 'all'
  });
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const { orders, loading, error, updateOrderStatus, updateOrderAddress } = useOrders(filters);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await getInventoryLevels();
        setInventory(data);
      } catch (err) {
        console.error('Failed to load inventory:', err);
      }
    };
    loadInventory();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600">{error.message}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <OrderMetrics orders={orders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <OrderFilters 
              filters={filters} 
              onChange={setFilters} 
            />
            <InventoryStatus inventory={inventory} />
          </div>
        </div>

        <div className="lg:col-span-3">
          <OrderList 
            orders={orders}
            onStatusUpdate={updateOrderStatus}
            onAddressUpdate={updateOrderAddress}
          />
        </div>
      </div>
    </div>
  );
};