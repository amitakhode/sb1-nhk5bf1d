import React from 'react';
import { CheckCircle, Clock, Package, XCircle, AlertCircle } from 'lucide-react';
import type { OrderStatus } from '../../../types/orders';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  new: {
    icon: Clock,
    text: 'New Order',
    className: 'bg-blue-100 text-blue-800'
  },
  in_progress: {
    icon: Package,
    text: 'In Progress',
    className: 'bg-yellow-100 text-yellow-800'
  },
  ready: {
    icon: CheckCircle,
    text: 'Ready for Delivery',
    className: 'bg-green-100 text-green-800'
  },
  completed: {
    icon: CheckCircle,
    text: 'Completed',
    className: 'bg-gray-100 text-gray-800'
  },
  cancelled: {
    icon: XCircle,
    text: 'Cancelled',
    className: 'bg-red-100 text-red-800'
  }
} as const;

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  // Fallback for unknown status
  const config = statusConfig[status] || {
    icon: AlertCircle,
    text: 'Unknown Status',
    className: 'bg-gray-100 text-gray-800'
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <Icon className="w-4 h-4 mr-1" />
      {config.text}
    </span>
  );
};