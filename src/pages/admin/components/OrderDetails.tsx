import React, { useState } from 'react';
import { format } from 'date-fns';
import { Package, MapPin, Phone, Calendar, DollarSign } from 'lucide-react';
import { OrderTimeline } from './OrderTimeline';
import { formatPrice } from '../../../utils/format';
import { useAddresses } from '../../../hooks/useAddresses';
import type { Order } from '../../../types/orders';
import type { Database } from '../../../lib/supabase-types';

type Address = Database['public']['Tables']['addresses']['Row'];

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onUpdateAddress?: (orderId: string, addressId: string) => Promise<void>;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ 
  order, 
  onClose,
  onUpdateAddress 
}) => {
  const { addresses, loading: addressesLoading } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState(order.address_id || '');
  const [updating, setUpdating] = useState(false);

  const handleAddressChange = async (addressId: string) => {
    if (!onUpdateAddress) return;
    
    setUpdating(true);
    try {
      await onUpdateAddress(order.id, addressId);
      setSelectedAddressId(addressId);
    } catch (err) {
      console.error('Failed to update address:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Order Details #{order.id.slice(0, 8)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Order Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span>
                    {format(new Date(order.created_at), 'PPp')}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                  <span>
                    Total Amount: {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Customer Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{order.profiles?.phone || 'No phone number'}</span>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium">Delivery Address</span>
                  </div>
                  {onUpdateAddress ? (
                    <div className="ml-6">
                      <select
                        value={selectedAddressId}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        disabled={updating || addressesLoading}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select Address</option>
                        {addresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                            , {address.city}, {address.state} - {address.pincode}
                          </option>
                        ))}
                      </select>
                      {updating && (
                        <p className="text-sm text-gray-500 mt-1">Updating address...</p>
                      )}
                    </div>
                  ) : order.delivery_address ? (
                    <div className="ml-6">
                      <p className="text-sm text-gray-600">
                        {order.delivery_address.address_line1}
                        {order.delivery_address.address_line2 && `, ${order.delivery_address.address_line2}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.delivery_address.city}, {order.delivery_address.state}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.delivery_address.pincode}
                      </p>
                    </div>
                  ) : (
                    <p className="ml-6 text-sm text-gray-500">No address selected</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Ordered Items
              </h3>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {item.toy?.image_url ? (
                        <img 
                          src={item.toy.image_url} 
                          alt={item.toy.name} 
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.toy?.name}</h4>
                        <p className="text-sm text-gray-600">
                          Rental Duration: {item.duration} days
                        </p>
                        <div className="mt-1 text-sm">
                          <span className="text-gray-600">
                            Rental: {formatPrice(item.rental_amount)}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="text-blue-600">
                            Deposit: {formatPrice(item.deposit_amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Order Timeline
            </h3>
            <OrderTimeline order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};