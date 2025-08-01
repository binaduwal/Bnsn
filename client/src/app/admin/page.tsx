'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Users, FolderOpen, FileText, Activity, UserCheck, TrendingUp, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalBlueprints: 0,
    totalActivities: 0,
    todayActivities: 0,
    newUsersThisMonth: 0,
    activeUsersThisMonth: 0,
    averageWordsPerUser: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to Admin Dashboard</h1>
            <p className="text-blue-100 text-lg">Monitor and manage your application with comprehensive insights</p>
          </div>
          <div className="hidden md:block">
            <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <div className="text-blue-100 text-sm">Total Users</div>
            </div>
          </div>
          <div className="flex items-center text-blue-100 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{stats.newUsersThisMonth} this month
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <UserCheck className="h-6 w-6" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.activeUsersThisMonth}</div>
              <div className="text-green-100 text-sm">Active Users</div>
            </div>
          </div>
          <div className="text-green-100 text-sm">This month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalProjects}</div>
              <div className="text-purple-100 text-sm">Total Projects</div>
            </div>
          </div>
          <div className="text-purple-100 text-sm">User projects</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalBlueprints}</div>
              <div className="text-orange-100 text-sm">Blueprints</div>
            </div>
          </div>
          <div className="text-orange-100 text-sm">Content templates</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                User Activity Overview
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.todayActivities}</div>
                  <div className="text-sm text-gray-600">Today's Activities</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.averageWordsPerUser.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Avg Words/User</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalActivities}</div>
                  <div className="text-sm text-gray-600">Total Activities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              Quick Stats
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">User Growth</span>
              <span className="text-sm font-bold text-green-600">+{Math.round((stats.newUsersThisMonth / stats.totalUsers) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Activity Rate</span>
              <span className="text-sm font-bold text-blue-600">{Math.round((stats.activeUsersThisMonth / stats.totalUsers) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Projects/User</span>
              <span className="text-sm font-bold text-purple-600">{(stats.totalProjects / stats.totalUsers).toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Templates/User</span>
              <span className="text-sm font-bold text-orange-600">{(stats.totalBlueprints / stats.totalUsers).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 