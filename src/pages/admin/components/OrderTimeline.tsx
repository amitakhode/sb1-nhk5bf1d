import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react';
import type { Order } from '../../../types/orders';

interface OrderTimelineProps {
  order: Order;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const timeline = [
    {
      status: 'new',
      icon: Clock,
      title: 'Order Placed',
      date: order.created_at,
      isCompleted: true
    },
    {
      status: 'in_progress',
      icon: Package,
      title: 'Processing',
      date: order.status === 'in_progress' ? order.updated_at : null,
      isCompleted: ['in_progress', 'ready', 'completed'].includes(order.status)
    },
    {
      status: 'ready',
      icon: Truck,
      title: 'Ready for Delivery',
      date: order.status === 'ready' ? order.updated_at : null,
      isCompleted: ['ready', 'completed'].includes(order.status)
    },
    {
      status: 'completed',
      icon: CheckCircle,
      title: 'Delivered',
      date: order.status === 'completed' ? order.updated_at : null,
      isCompleted: order.status === 'completed'
    }
  ];

  if (order.status === 'cancelled') {
    timeline.push({
      status: 'cancelled',
      icon: XCircle,
      title: 'Cancelled',
      date: order.updated_at,
      isCompleted: true
    });
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {timeline.map((event, idx) => (
          <li key={event.status}>
            <div className="relative pb-8">
              {idx !== timeline.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`
                    h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                    ${event.isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}
                  `}>
                    <event.icon 
                      className={`w-5 h-5 ${event.isCompleted ? 'text-white' : 'text-gray-500'}`} 
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5">
                  <p className="text-sm font-medium text-gray-900">
                    {event.title}
                  </p>
                  {event.date && (
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.date), 'PPp')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};