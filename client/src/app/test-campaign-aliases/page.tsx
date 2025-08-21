'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/services/projectApi';
import CampaignAccordion from '@/components/CampainAccordion';
import toast from 'react-hot-toast';

const TestCampaignAliasesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock project ID for testing
  const mockProjectId = '507f1f77bcf86cd799439011';

  // Mock categories data for testing
  useEffect(() => {
    const mockCategories: Category[] = [
      {
        _id: '1',
        title: 'Email Marketing',
        alias: 'Email Marketing',
        type: 'project',
        parentId: null,
        description: 'Email marketing campaigns',
        fields: [],
        fieldValue: { _id: '1', category: '1', project: mockProjectId, isAiGeneratedContent: '', value: [], __v: 0 },
        level: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        subCategories: [
          {
            _id: 'sub1',
            title: 'Welcome Series',
            alias: 'Welcome Series',
            type: 'project',
            parentId: '1',
            description: 'Welcome email series',
            fields: [],
            level: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
            thirdCategories: [
              {
                _id: 'third1',
                title: 'Welcome Email 1',
                alias: 'Welcome Email 1',
                type: 'project',
                parentId: 'sub1',
                description: 'First welcome email',
                fields: [],
                level: 2,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                __v: 0,
                fieldValue: { _id: 'third1', category: 'third1', project: mockProjectId, isAiGeneratedContent: '', value: [], __v: 0 }
              },
              {
                _id: 'third2',
                title: 'Welcome Email 2',
                alias: 'Welcome Email 2',
                type: 'project',
                parentId: 'sub1',
                description: 'Second welcome email',
                fields: [],
                level: 2,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                __v: 0,
                fieldValue: { _id: 'third2', category: 'third2', project: mockProjectId, isAiGeneratedContent: '', value: [], __v: 0 }
              }
            ],
            fieldValue: { _id: 'sub1', category: 'sub1', project: mockProjectId, isAiGeneratedContent: '', value: [], __v: 0 }
          },
          {
            _id: 'sub2',
            title: 'Promotional Campaigns',
            alias: 'Promotional Campaigns',
            type: 'project',
            parentId: '1',
            description: 'Promotional email campaigns',
            fields: [],
            level: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
            thirdCategories: [
              {
                _id: 'third3',
                title: 'Product Launch',
                alias: 'Product Launch',
                type: 'project',
                parentId: 'sub2',
                description: 'Product launch campaign',
                fields: [],
                level: 2,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                __v: 0,
                fieldValue: { _id: 'third3', category: 'third3', project: mockProjectId, isAiGeneratedContent: '', value: [], __v: 0 }
              }
            ],
            fieldValue: { _id: 'sub2', category: 'sub2', project: mockProjectId, isAiGeneratedContent: '', value: [], __v: 0 }
          }
        ]
      }
    ];

    setCategories(mockCategories);
  }, []);

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    console.log('Category changed to:', id);
  };

  const handleCampaignSelect = (campaignTitle: string) => {
    setSelectedCampaign(selectedCampaign === campaignTitle ? null : campaignTitle);
    console.log('Campaign selected:', campaignTitle);
  };

  const handleCampaignUpdate = (oldAlias: string, newAlias: string) => {
    console.log('Campaign alias updated:', { oldAlias, newAlias });
    // In a real app, this would update the backend
    toast.success(`Campaign alias updated from "${oldAlias}" to "${newAlias}"`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Campaign Alias Test
          </h1>
          <p className="text-gray-600 mb-6">
            This page demonstrates the project-specific campaign alias functionality. 
            Users can customize campaign and template aliases for their specific project.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">How it works:</h3>
            <ul className="text-blue-800 space-y-1">
              <li>• Hover over any campaign or template name to see the edit icon</li>
              <li>• Click the edit icon to customize the alias for this project</li>
              <li>• Custom aliases are stored per user and per project</li>
              <li>• If no custom alias is set, the admin's default alias is used</li>
              <li>• Click the revert icon to remove a custom alias and use the default</li>
              <li>• Custom aliases are marked with "(custom)" indicator</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Test Instructions:</h3>
            <ul className="text-green-800 space-y-1">
              <li>• Try editing the "Welcome Series" campaign alias</li>
              <li>• Try editing the "Welcome Email 1" template alias</li>
              <li>• Expand campaigns to see template editing</li>
              <li>• Check the browser console for update logs</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Campaign Library</h2>
            <p className="text-sm text-gray-600 mt-1">Project ID: {mockProjectId}</p>
          </div>
          
          <div className="p-6">
            <CampaignAccordion
              projectId={mockProjectId}
              campaigns={categories}
              selectedCampaign={selectedCampaign}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onCampaignSelect={handleCampaignSelect}
              onCampaignUpdate={handleCampaignUpdate}
            />
          </div>
        </div>

        {categories.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600">Mock data should be loaded automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCampaignAliasesPage; 