import React from 'react';

const OrganizationSubscriptions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Organization Subscriptions Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Organization Subscriptions</h1>
          
          {/* Subscriptions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-6">No active subscriptions found.</p>
              <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-medium">
                View Available Plans
              </button>
            </div>
          </div>
        </div>

        {/* One-time Orders Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">One-time Orders</h2>
          
          {/* Orders Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-12 text-center">
              <p className="text-gray-600">No one-time orders found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSubscriptions;