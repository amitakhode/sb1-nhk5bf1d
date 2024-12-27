import { useState, useEffect } from 'react';
import { fetchOrders, updateOrder, updateOrderAddress } from '../services/orders';
import type { Order, OrderStatus, OrderFilter } from '../types/orders';

export const useOrders = (filters: OrderFilter) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders(filters);
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load orders'));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [filters]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await updateOrder(orderId, { status });
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update order');
    }
  };

  const handleUpdateAddress = async (orderId: string, addressId: string) => {
    try {
      const updatedOrder = await updateOrderAddress(orderId, addressId);
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update order address');
    }
  };

  return { 
    orders, 
    loading, 
    error, 
    updateOrderStatus: handleUpdateStatus,
    updateOrderAddress: handleUpdateAddress
  };
};