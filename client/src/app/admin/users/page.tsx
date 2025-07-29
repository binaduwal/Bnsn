'use client';

import React, { useState, useEffect } from 'react';
import { adminApi, AdminUser, PaginatedResponse } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { Search, Edit, Trash2, Plus, Eye, Users } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 25
  });

  useEffect(() => {
    loadUsers();
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers(
        pagination.currentPage,
        pagination.itemsPerPage,
        searchTerm
      );
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination(prev => ({ ...prev, itemsPerPage, currentPage: 1 }));
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(userId);
        await loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Users Management</h1>
            <p className="text-purple-100 text-lg">Monitor and manage user accounts with detailed insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="h-10 w-10 text-white" />
              </div>
            </div>
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 flex items-center space-x-2 transition-all duration-300 font-medium">
              <Plus className="h-5 w-5" />
              <span>Add New User</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">User Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Role & Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Usage Statistics</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Member Since</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold text-white ${
                          user.role === 'admin' 
                            ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}>
                          {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-gray-500 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                        user.role === 'admin' 
                          ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200' 
                          : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-900">{user.wordsUsed.toLocaleString()}</span>
                          <span className="text-gray-500">/ {user.totalWords.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min((user.wordsUsed / user.totalWords) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((user.wordsUsed / user.totalWords) * 100)}% used
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={async (updatedUser) => {
            try {
              await adminApi.updateUser(selectedUser._id, updatedUser);
              await loadUsers();
              setShowEditModal(false);
              setSelectedUser(null);
            } catch (error) {
              console.error('Error updating user:', error);
            }
          }}
        />
      )}
    </div>
  );
}

interface EditUserModalProps {
  user: AdminUser;
  onClose: () => void;
  onSave: (user: Partial<AdminUser>) => void;
}

function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    role: user.role,
    totalWords: user.totalWords,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl px-6 py-4">
          <h2 className="text-xl font-bold text-white">Edit User Profile</h2>
          <p className="text-blue-100 text-sm mt-1">Update user information and permissions</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">User Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            >
              <option value="user">User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Word Limit</label>
            <input
              type="number"
              value={formData.totalWords}
              onChange={(e) => setFormData({ ...formData, totalWords: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter word limit"
              min="0"
            />
          </div>
          <div className="flex space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 