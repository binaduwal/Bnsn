'use client';

import React from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium text-gray-700">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useAdminAuth
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    Welcome back, Admin
                  </div>
                  <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">A</span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 