"use client";

import React, { useState } from 'react';
import {
  CreditCard,
  Calendar,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Plus,
  Filter,
  Search,
  Star,
  Activity,
  TrendingUp,
  ShoppingCart,
  Receipt,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  type: 'subscription' | 'one-time';
  title: string;
  amount: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  date: string;
  nextBilling?: string;
  description: string;
}

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'subscriptions' | 'orders'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockOrders: Order[] = [
    {
      id: '1',
      type: 'subscription',
      title: 'Premium Plan',
      amount: 29.99,
      status: 'active',
      date: '2024-01-15',
      nextBilling: '2024-02-15',
      description: 'Monthly premium subscription with unlimited access'
    },
    {
      id: '2', 
      type: 'one-time',
      title: 'Custom Blueprint Package',
      amount: 149.99,
      status: 'completed',
      date: '2024-01-10',
      description: 'Professional blueprint templates for business growth'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="group bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-gray-200/60 p-6 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-50"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${
            order.type === 'subscription' 
              ? 'from-purple-500 to-purple-600' 
              : 'from-emerald-500 to-emerald-600'
          } rounded-xl flex items-center justify-center shadow-lg`}>
            {order.type === 'subscription' ? (
              <CreditCard className="w-6 h-6 text-white" />
            ) : (
              <Package className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                {order.title}
              </h3>
            </div>
            <p className={`text-sm font-medium flex items-center ${
              order.type === 'subscription' ? 'text-purple-600' : 'text-emerald-600'
            }`}>
              {order.type === 'subscription' ? <Star className="w-3 h-3 mr-1" /> : <Receipt className="w-3 h-3 mr-1" />}
              {order.type === 'subscription' ? 'Subscription' : 'One-time Purchase'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-600">{order.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(order.date).toLocaleDateString()}</span>
            {order.nextBilling && (
              <>
                <span className="text-gray-400">•</span>
                <span>Next: {new Date(order.nextBilling).toLocaleDateString()}</span>
              </>
            )}
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}
          >
            {getStatusIcon(order.status)}
            <span className="ml-1.5 capitalize">{order.status}</span>
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-2xl font-bold text-gray-900">
            ${order.amount.toFixed(2)}
            {order.type === 'subscription' && <span className="text-sm font-normal text-gray-500">/month</span>}
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'subscriptions' && order.type === 'subscription') ||
                      (activeTab === 'orders' && order.type === 'one-time');
    return matchesSearch && matchesTab;
  });

  const subscriptions = mockOrders.filter(order => order.type === 'subscription');
  const oneTimeOrders = mockOrders.filter(order => order.type === 'one-time');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full mx-auto px-6 py-8">
        {/* Modern Hero Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>Order Management</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
              Orders & Subscriptions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage your subscriptions and track your purchase history
            </p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <Link
              href="/dashboard/purchase"
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Plus size={24} className="relative z-10" />
              <ShoppingCart size={24} className="relative z-10" />
              <span className="relative z-10">Make New Purchase</span>
            </Link>
          </div>

          {/* Enhanced Search and Filter Bar */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search orders and subscriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
                />
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>

              <button className="flex items-center space-x-2 px-6 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <Filter size={18} className="text-purple-600" />
                <span className="font-medium text-gray-700">Advanced Filters</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center space-x-1 mb-8">
            {[
              { key: 'all', label: 'All Orders', count: mockOrders.length },
              { key: 'subscriptions', label: 'Subscriptions', count: subscriptions.length },
              { key: 'orders', label: 'One-time Orders', count: oneTimeOrders.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-xl border border-transparent text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-2xl border border-purple-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{subscriptions.length}</div>
                  <div className="text-xs text-purple-600 font-medium">Active</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Subscriptions</h3>
                <div className="w-full bg-purple-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{oneTimeOrders.length}</div>
                  <div className="text-xs text-emerald-600 font-medium">Completed</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">One-time Orders</h3>
                <div className="w-full bg-emerald-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">$179.98</div>
                  <div className="text-xs text-blue-600 font-medium">Total spent</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Revenue</h3>
                <div className="w-full bg-blue-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">2</div>
                  <div className="text-xs text-amber-600 font-medium">This month</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Activity</h3>
                <div className="w-full bg-amber-200/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search criteria to find what you\'re looking for'
                : 'Start by purchasing your first subscription or product to see your orders here'
              }
            </p>
            <Link
              href="/dashboard/purchase"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
            >
              <Plus size={20} />
              <Sparkles size={20} />
              <span>Browse Products</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;