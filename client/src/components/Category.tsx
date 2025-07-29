"use client";

import { ChevronDown, HelpCircle, X, Edit2 } from "lucide-react";
import { useState } from "react";

interface CategoryProps {
  id: string;
  title: string;
  alias: string;
  isExpanded?: boolean;
  isActive?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
  onUpdate?: (id: string, data: { alias: string }) => void;
  children?: React.ReactNode;
}

export const Category: React.FC<CategoryProps> = ({
  id,
  title,
  alias,
  isExpanded = false,
  isActive = false,
  onToggle,
  onRemove,
  onUpdate,
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(alias);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(alias);
  };

  const handleSave = () => {
    if (editValue.trim() && editValue !== alias && onUpdate) {
      onUpdate(id, { alias: editValue.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(alias);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 group">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 text-gray-700 font-medium text-base hover:text-gray-900 transition-colors ${
            isActive ? "underline" : ""
          }`}
        >
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="text-gray-700 font-medium text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <h3 className="text-gray-700 font-medium text-base">{alias}</h3>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
        <div title="Blueprint form" className="max-w-max">
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        {!isEditing && onUpdate && (
          <button
            onClick={handleEdit}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-gray-600"
            title="Edit alias"
          >
            <Edit2 className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-gray-600"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Expandable content area - would contain form fields when expanded */}
      {isExpanded && children && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};
