import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { Order, OrderStatus } from '../../../types/orders';

interface OrderActionsProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const OrderActions: React.FC<OrderActionsProps> = ({ order, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    new: 'in_progress',
    in_progress: 'ready',
    ready: 'completed',
    completed: null,
    cancelled: null
  };

  const actionLabels: Record<OrderStatus, string> = {
    new: 'Start Processing',
    in_progress: 'Mark Ready',
    ready: 'Complete Order',
    completed: '',
    cancelled: ''
  };

  const handleStatusUpdate = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening order details
    const next = nextStatus[order.status];
    if (!next) return;

    setLoading(true);
    setError(null);

    try {
      await onStatusUpdate(order.id, next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const next = nextStatus[order.status];
  if (!next) return null;

  return (
    <div className="flex items-center space-x-2">
      {error && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
      <button
        onClick={handleStatusUpdate}
        disabled={loading}
        className={`
          px-4 py-2 rounded-md text-sm font-medium
          ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}
          text-white transition-colors duration-200
        `}
      >
        {loading ? 'Updating...' : actionLabels[order.status]}
      </button>
    </div>
  );
};