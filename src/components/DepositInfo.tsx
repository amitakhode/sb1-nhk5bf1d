import React from 'react';
import { Shield, Info } from 'lucide-react';
import { formatPrice } from '../utils/format';

interface DepositInfoProps {
  depositAmount: number;
  depositTerms: string;
}

export const DepositInfo: React.FC<DepositInfoProps> = ({ depositAmount, depositTerms }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center text-primary">
        <Shield className="w-5 h-5 mr-2" />
        <span className="font-medium">Security Deposit</span>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <p className="font-medium text-blue-900">
              Refundable Deposit: {formatPrice(depositAmount)}
            </p>
            <p className="mt-1 text-sm text-blue-700">{depositTerms}</p>
          </div>
        </div>
      </div>
    </div>
  );
};