import React from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Order } from '../../../types/orders';

interface OrderMetricsProps {
  orders: Order[];
}

export const OrderMetrics: React.FC<OrderMetricsProps> = ({ orders }) => {
  const metrics = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Package className="w-8 h-8 text-emerald-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold">{metrics.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Clock className="w-8 h-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">New Orders</p>
            <p className="text-2xl font-semibold">{metrics.new}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Ready for Delivery</p>
            <p className="text-2xl font-semibold">{metrics.ready}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <XCircle className="w-8 h-8 text-gray-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="text-2xl font-semibold">{metrics.completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};