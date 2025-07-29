"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { confirmPaymentApi } from '@/services/paymentApi';
import { getWordCountApi } from '@/services/authApi';
import toast from 'react-hot-toast';

const PaymentSuccessPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [wordsAdded, setWordsAdded] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const paymentIntentId = searchParams.get('payment_intent');
        
        if (paymentIntentId) {
          const response = await confirmPaymentApi(paymentIntentId);
          if (response.success) {
            setWordsAdded(response.data.wordsAdded);
            toast.success('Payment successful! Words added to your account.');
          }
        }
      } catch (error: any) {
        console.error('Payment processing error:', error);
        toast.error('There was an issue processing your payment. Please contact support.');
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams]);

  const handleContinue = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          {isProcessing ? (
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment...</h2>
              <p className="text-gray-600">Please wait while we confirm your purchase.</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
              
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-gray-700 mb-2">Words Added:</p>
                <p className="text-3xl font-bold text-green-600">{wordsAdded.toLocaleString()}</p>
              </div>
              
              <p className="text-gray-600 mb-6">
                Your words have been added to your account. You can now continue creating amazing content!
              </p>
              
              <button
                onClick={handleContinue}
                className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Continue to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 