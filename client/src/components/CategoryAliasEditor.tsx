"use client";
import React, { useState, useEffect } from 'react';
import { Check, Pencil, X, RotateCcw } from "lucide-react";
import { useUserCategoryAlias } from '../hooks/useUserCategoryAlias';

interface CategoryAliasEditorProps {
  projectId: string;
  categoryId: string;
  defaultAlias: string;
  effectiveAlias?: string; // The effective alias (custom or default)
  onAliasChange?: (newAlias: string) => void;
  className?: string;
}

const CategoryAliasEditor: React.FC<CategoryAliasEditorProps> = ({
  projectId,
  categoryId,
  defaultAlias,
  effectiveAlias,
  onAliasChange,
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(defaultAlias);
  const [currentAlias, setCurrentAlias] = useState(defaultAlias);
  const [hasCustomAlias, setHasCustomAlias] = useState(false);

  const { 
    loading, 
    error, 
    getEffectiveAlias, 
    setCustomAlias, 
    removeCustomAlias 
  } = useUserCategoryAlias();

  // Load the current effective alias on mount or when effectiveAlias prop changes
  useEffect(() => {
    const loadEffectiveAlias = async () => {
      try {
        if (effectiveAlias) {
          // Use the effectiveAlias prop if provided
          setCurrentAlias(effectiveAlias);
          setHasCustomAlias(effectiveAlias !== defaultAlias);
        } else {
          // Fallback to API call
          const apiEffectiveAlias = await getEffectiveAlias(projectId, categoryId);
          setCurrentAlias(apiEffectiveAlias);
          setHasCustomAlias(apiEffectiveAlias !== defaultAlias);
        }
      } catch (err) {
        console.error('Failed to load effective alias:', err);
      }
    };

    loadEffectiveAlias();
  }, [projectId, categoryId, defaultAlias, effectiveAlias, getEffectiveAlias]);

  const handleSave = async () => {
    try {
      if (editValue.trim() === '') {
        setEditValue(currentAlias);
        setIsEditing(false);
        return;
      }

      if (editValue === defaultAlias) {
        // If user sets it back to default, remove the custom alias
        await removeCustomAlias(projectId, categoryId);
        setHasCustomAlias(false);
      } else {
        // Set custom alias
        await setCustomAlias(projectId, categoryId, editValue.trim());
        setHasCustomAlias(true);
      }

      setCurrentAlias(editValue.trim());
      setIsEditing(false);
      onAliasChange?.(editValue.trim());
    } catch (err) {
      console.error('Failed to save alias:', err);
      setEditValue(currentAlias);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(currentAlias);
    setIsEditing(false);
  };

  const handleRevertToDefault = async () => {
    try {
      await removeCustomAlias(projectId, categoryId);
      setCurrentAlias(defaultAlias);
      setHasCustomAlias(false);
      onAliasChange?.(defaultAlias);
    } catch (err) {
      console.error('Failed to revert to default:', err);
    }
  };

  const startEditing = () => {
    setEditValue(currentAlias);
    setIsEditing(true);
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`group relative ${className}`}>
      {!isEditing ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {currentAlias}
            {hasCustomAlias && (
              <span className="ml-1 text-xs text-blue-600">(custom)</span>
            )}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startEditing();
              }}
              className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors duration-150"
              title="Edit alias"
            >
              <Pencil className="w-3.5 h-3.5 text-blue-500 hover:text-blue-600" />
            </button>
            {hasCustomAlias && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRevertToDefault();
                }}
                className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                title="Revert to default"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-500 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder="Enter custom alias"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 transition-colors"
              title="Save"
            >
              <Check className="w-3.5 h-3.5 text-green-600 hover:text-green-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5 text-red-600 hover:text-red-700" />
            </button>
          </div>
        </div>
      )}
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  );
};

export default CategoryAliasEditor; 