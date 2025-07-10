"use client";

import type React from "react";
import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";

interface EditableTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
  className?: string;
  placeholder?: string;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  title,
  onSave,
  className = "",
  placeholder = "Enter title...",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const handleSave = () => {
    if (editValue.trim() && editValue.trim() !== title) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-40  rounded-md  text-xl border-transparent outline-none font-semibold text-gray-900 "
          placeholder={placeholder}
          autoFocus
        />
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            title="Save"
          >
            <Check className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1.5 rounded-md opacity-100 hover:bg-gray-100 transition-all"
        title="Edit title"
      >
        <Pencil className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};

export default EditableTitle;
