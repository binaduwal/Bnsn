"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  Loader, 
  Zap, 
  Users, 
  Shield, 
  TrendingUp,
  DollarSign,
  Package,
  Star,
  Activity,
  Sparkles,
  ShoppingCart,
  Clock,
  Gift
} from 'lucide-react';
import { createCheckoutSessionApi } from '@/services/paymentApi';
import toast from 'react-hot-toast';

const WordPurchasePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('100k');
  const router = useRouter();

  const packages = [
    {
      id: '10k',
      name: '10,000 Words',
      price: 5,
      words: '10,000',
      description: 'Perfect for small projects',
      features: ['All content types', 'Instant access', 'No expiration'],
      popular: false,
      color: 'blue'
    },
    {
      id: '100k',
      name: '100,000 Words',
      price: 10,
      words: '100,000',
      description: 'Most popular for content creators',
      features: ['All content types', 'Instant access', 'No expiration', 'Priority support'],
      popular: true,
      color: 'purple'
    },
    {
      id: '500k',
      name: '500,000 Words',
      price: 40,
      words: '500,000',
      description: 'Best value for agencies',
      features: ['All content types', 'Instant access', 'No expiration', 'Priority support', 'Custom templates'],
      popular: false,
      color: 'emerald'
    }
  ];

  const handlePurchase = async (packageData: any) => {
    try {
      setIsLoading(true);
      const response = await createCheckoutSessionApi(packageData.price);
      
      if (response.success && response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full mx-auto px-6 py-8">
        {/* Modern Hero Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>Word Packages</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
              Purchase Word Credits
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Power your content creation with AI-generated words. Choose the perfect package for your needs.
            </p>
          </div>

          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <div className="text-xs text-blue-600 font-medium">Packages</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Available Options</h3>
                <div className="w-full bg-blue-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-2xl border border-purple-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">100K</div>
                  <div className="text-xs text-purple-600 font-medium">Most Popular</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Recommended</h3>
                <div className="w-full bg-purple-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">Best</div>
                  <div className="text-xs text-emerald-600 font-medium">Value</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">500K Package</h3>
                <div className="w-full bg-emerald-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{width: '95%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">Instant</div>
                  <div className="text-xs text-amber-600 font-medium">Delivery</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Immediate Access</h3>
                <div className="w-full bg-amber-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                pkg.popular 
                  ? 'border-purple-200 ring-2 ring-purple-100' 
                  : 'border-gray-200/60'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white">
                    ⭐ Most Popular
                  </div>
                </div>
              )}

              {/* Gradient accent bar */}
              <div className={`h-1.5 bg-gradient-to-r ${
                pkg.color === 'blue' ? 'from-blue-500 to-blue-600' :
                pkg.color === 'purple' ? 'from-purple-500 to-purple-600' :
                'from-emerald-500 to-emerald-600'
              }`} />

              <div className="p-8">
                {/* Package Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg bg-gradient-to-br ${
                    pkg.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    pkg.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    'from-emerald-500 to-emerald-600'
                  }`}>
                    {pkg.color === 'blue' ? <Zap className="w-8 h-8 text-white" /> :
                     pkg.color === 'purple' ? <Star className="w-8 h-8 text-white" /> :
                     <Gift className="w-8 h-8 text-white" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">${pkg.price}</span>
                    <span className="text-gray-600 text-lg">USD</span>
                  </div>
                  <p className="text-gray-600">One-time payment</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        pkg.color === 'blue' ? 'text-blue-500' :
                        pkg.color === 'purple' ? 'text-purple-500' :
                        'text-emerald-500'
                      }`} />
                      <span className="text-gray-700 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={isLoading}
                  className={`w-full inline-flex items-center justify-center gap-3 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg'
                      : pkg.color === 'blue'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Purchase {pkg.words} Words
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Trust Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Choose Our Platform?</h2>
            <p className="text-gray-600">Trusted by thousands of content creators worldwide</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Secure Payment</h3>
              <p className="text-gray-600">
                Your payment is processed securely through Stripe with bank-level encryption
              </p>
            </div>
            
            <div className="group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Trusted Platform</h3>
              <p className="text-gray-600">
                Join over 10,000+ content creators who trust our AI-powered platform
              </p>
            </div>
            
            <div className="group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Instant Delivery</h3>
              <p className="text-gray-600">
                Words are added to your account immediately after successful payment
              </p>
            </div>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Need help choosing the right package? 
            <button className="text-blue-600 hover:text-blue-700 font-medium ml-1 underline decoration-blue-600/30 hover:decoration-blue-700">
              Contact our support team
            </button>
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />
              30-day money back guarantee
            </span>
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1.5 text-blue-500" />
              SSL encrypted checkout
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-purple-500" />
              24/7 customer support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPurchasePage; 