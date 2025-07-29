"use client";

import React, { useState, useEffect } from 'react';
import { Category, allCategoryApi, updateCategoryApi } from '@/services/categoryApi';
import { Category as CategoryComponent } from './Category';

const CategoryTest: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await allCategoryApi('project', 0);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryUpdate = async (id: string, data: { alias: string }) => {
    try {
      await updateCategoryApi(id, data);
      // Refresh categories after update
      await fetchCategories();
      console.log('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleCategoryToggle = (id: string) => {
    // Toggle expansion state if needed
    console.log('Toggle category:', id);
  };

  const handleCategoryRemove = (id: string) => {
    // Handle category removal if needed
    console.log('Remove category:', id);
  };

  if (loading) {
    return <div className="p-4">Loading categories...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Category Alias Test</h2>
      <p className="text-gray-600 mb-4">
        Click the edit icon next to any category name to change its alias. The alias is what users see instead of the internal title.
      </p>
      <div className="space-y-4">
        {categories.slice(0, 5).map((category) => (
          <CategoryComponent
            key={category._id}
            id={category._id}
            title={category.title}
            alias={category.alias}
            isExpanded={false}
            isActive={false}
            onToggle={() => handleCategoryToggle(category._id)}
            onRemove={() => handleCategoryRemove(category._id)}
            onUpdate={handleCategoryUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryTest; 