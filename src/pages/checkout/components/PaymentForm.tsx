import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { createOrder } from '../../../services/orders';
import { PaymentMethodSelector } from './payment/PaymentMethodSelector';
import { UPIForm } from './payment/UPIForm';
import { CODForm } from './payment/CODForm';
import type { Database } from '../../../lib/supabase-types';
import type { PaymentMethod } from '../../../types/payment';

type Address = Database['public']['Tables']['addresses']['Row'];

interface PaymentFormProps {
  address: Address;
  total: number;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ address, total }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { cart, clearCart } = useStore();

  const handlePayment = async (formData: { upiId?: string }) => {
    setLoading(true);
    setError('');

    try {
      const orderItems = cart.map(item => ({
        toyId: item.toy.id,
        duration: item.duration,
        rentalAmount: item.toy.pricePerDay * item.duration,
        depositAmount: item.toy.depositAmount
      }));

      await createOrder({
        items: orderItems,
        paymentMethod,
        addressId: address.id,
        upiId: formData.upiId
      });

      clearCart();
      navigate('/order-success');
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <PaymentMethodSelector
        selected={paymentMethod}
        onChange={setPaymentMethod}
      />

      {paymentMethod === 'upi' ? (
        <UPIForm
          onSubmit={handlePayment}
          loading={loading}
          total={total}
        />
      ) : (
        <CODForm
          onSubmit={handlePayment}
          loading={loading}
          total={total}
        />
      )}
    </div>
  );
};