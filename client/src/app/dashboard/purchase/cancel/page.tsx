"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCancelPage: React.FC = () => {
  const router = useRouter();

  const handleTryAgain = () => {
    router.push('/dashboard/purchase');
  };

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Cancelled</h2>
          
          <p className="text-gray-600 mb-8">
            Your payment was cancelled. No charges were made to your account. You can try again anytime.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleTryAgain}
              className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            
            <button
              onClick={handleGoBack}
              className="w-full inline-flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage; 