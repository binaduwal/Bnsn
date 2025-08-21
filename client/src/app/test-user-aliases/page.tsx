'use client';

import React, { useState, useEffect } from 'react';
import { allCategoryApi } from '@/services/categoryApi';
import { Category } from '@/services/categoryApi';
import CategoryAliasEditor from '@/components/CategoryAliasEditor';

const TestUserAliasesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Use a mock projectId for testing - in real usage this would come from the current project context
      const mockProjectId = '507f1f77bcf86cd799439011'; // Mock ObjectId
      const response = await allCategoryApi('project', 0, mockProjectId);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAliasChange = (categoryId: string, newAlias: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat._id === categoryId 
          ? { ...cat, effectiveAlias: newAlias }
          : cat
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Category Alias Test
          </h1>
          <p className="text-gray-600 mb-6">
            This page demonstrates the user-specific category alias functionality. 
            Users can customize category aliases for their own use while keeping the admin's default aliases as fallbacks.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">How it works:</h3>
            <ul className="text-blue-800 space-y-1">
              <li>• Click the edit icon next to any category name to customize its alias</li>
              <li>• Custom aliases are stored per user and only visible to that user</li>
              <li>• If no custom alias is set, the admin's default alias is used</li>
              <li>• Click the revert icon to remove a custom alias and use the default</li>
              <li>• Custom aliases are marked with "(custom)" indicator</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6">
          {categories.slice(0, 10).map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="flex-1">
                                             <CategoryAliasEditor
                         projectId="507f1f77bcf86cd799439011" // Mock projectId for testing
                         categoryId={category._id}
                         defaultAlias={category.alias || category.title}
                         effectiveAlias={category.effectiveAlias}
                         onAliasChange={(newAlias) => handleAliasChange(category._id, newAlias)}
                         className="text-xl font-semibold"
                       />
                      <p className="text-sm text-gray-500 mt-1">
                        Original: {category.title} | Admin Alias: {category.alias}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    category.type === 'blueprint' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {category.type}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Level {category.level}
                  </span>
                </div>
              </div>
              
              {category.description && (
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {category.fields.length} field{category.fields.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">There are no project categories available to test with.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestUserAliasesPage; 