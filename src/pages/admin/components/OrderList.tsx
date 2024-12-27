import React, { useState } from 'react';
import { format } from 'date-fns';
import { Package, Clock, AlertTriangle } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderActions } from './OrderActions';
import { OrderDetails } from './OrderDetails';
import type { Order, OrderStatus } from '../../../types/orders';

interface OrderListProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, status: OrderStatus) => Promise<void>;
  onAddressUpdate: (orderId: string, addressId: string) => Promise<void>;
}

export const OrderList: React.FC<OrderListProps> = ({ 
  orders, 
  onStatusUpdate,
  onAddressUpdate
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Date not available';
    try {
      return format(new Date(dateStr), 'PPp');
    } catch (err) {
      console.error('Invalid date:', dateStr);
      return 'Invalid date';
    }
  };

  const getCustomerName = (order: Order) => {
    if (!order.profiles) return 'Unknown Customer';
    const { first_name, last_name } = order.profiles;
    if (!first_name && !last_name) return 'Unknown Customer';
    return `${first_name || ''} ${last_name || ''}`.trim();
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      {orders.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <h3 className="text-lg font-medium">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                  <p>{getCustomerName(order)}</p>
                  <p className="text-sm text-gray-600">{order.profiles?.phone || 'No phone'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
                  <p className="text-sm">
                    {order.delivery_address?.address_line1 || 'No address'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">Processing time: 2h 15m</span>
                  </div>
                  {order.priority === 'high' && (
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span className="text-sm">High Priority</span>
                    </div>
                  )}
                </div>
                <OrderActions 
                  order={order}
                  onStatusUpdate={onStatusUpdate}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          onUpdateAddress={onAddressUpdate}
        />
      )}
    </div>
  );
};