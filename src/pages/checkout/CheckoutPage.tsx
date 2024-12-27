import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AddressForm } from './components/AddressForm';
import { PaymentForm } from './components/PaymentForm';
import { OrderSummary } from '../../components/checkout/OrderSummary';
import type { Database } from '../../lib/supabase-types';

type Address = Database['public']['Tables']['addresses']['Row'];

export const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { cart } = useStore();
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => 
    sum + (item.toy.pricePerDay * item.duration), 0
  );
  const totalDeposit = cart.reduce((sum, item) => 
    sum + item.toy.depositAmount, 0
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  step === 'address' ? 'bg-emerald-600 text-white' : 'bg-gray-200'
                }`}>
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="ml-2 font-medium">Delivery Address</span>
              </div>
              <div className="ml-4 flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  step === 'payment' ? 'bg-emerald-600 text-white' : 'bg-gray-200'
                }`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>

            {step === 'address' ? (
              <AddressForm 
                onNext={() => setStep('payment')}
                onAddressSelect={setSelectedAddress}
              />
            ) : (
              <PaymentForm 
                address={selectedAddress!}
                total={subtotal + Math.round(subtotal * 0.18) + totalDeposit}
              />
            )}
          </div>
        </div>

        <OrderSummary 
          subtotal={subtotal}
          totalDeposit={totalDeposit}
        />
      </div>
    </div>
  );
};