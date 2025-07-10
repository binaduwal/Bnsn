"use client";

import type React from "react";
import { useState } from "react";
import {
  Search,
  Copy,
  FileText,
  ChevronDown,
  HelpCircle,
  X,
  Plus,
} from "lucide-react";
import EditableInput from "./ui/EditableInput";
import { Category } from "./Category";

interface TagProps {
  text: string;
  onRemove?: () => void;
}

const Tag: React.FC<TagProps> = ({ text, onRemove }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
      {text}
      {onRemove && (
        <button onClick={onRemove} className="ml-2 hover:text-blue-600">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  hasDropdown?: boolean;
  onClose?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  hasDropdown,
  onClose,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-gray-700 font-medium text-base">{label}</h3>
        {hasDropdown && <ChevronDown className="w-4 h-4 text-gray-400" />}
        <HelpCircle className="w-4 h-4 text-gray-400" />
        {onClose && (
          <button onClick={onClose} className="ml-auto">
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

const BlueprintForm: React.FC = () => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [categories, setCategories] = useState([
    { id: "bio", name: "Bio", isActive: false },
    { id: "buyers", name: "Buyers", isActive: false },
    { id: "company", name: "Company", isActive: false },
    { id: "offers", name: "Offers", isActive: true }, // This one appears underlined in the image
    { id: "pages", name: "Pages", isActive: false },
    { id: "miscellaneous", name: "Miscellaneous", isActive: false },
    { id: "training", name: "Training", isActive: false },
    { id: "bookbuilder", name: "BookBuilder", isActive: false },
    { id: "custom", name: "Custom", isActive: false },
  ]);
  const [backstory] = useState(
    "John saw the gap in traditional productivity methods and combined AI with neuroscience to create a system that truly enhances productivity without burnout."
  );

  const [credentials] = useState(["Productivity Expert", "AI Specialist"]);
  const [beforeTags] = useState([
    "stressed and overwhelmed entrepreneur",
    "burned-out consultant",
  ]);
const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["bio"])
);
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const removeCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      newSet.delete(categoryId);
      return newSet;
    });
  };

  return (
    <div className=" bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EditableInput text="Productivity Course Demo" setText={() => {}} />
            <Copy className="w-4 h-4 text-gray-400" />
            <FileText className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by blueprint field name..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by blueprint field text..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className=" p-8 max-h-[calc(100vh-14.5rem)] overflow-y-auto">
        {categories.map((category) => (
          <Category
            key={category.id}
            name={category.name}
            isExpanded={expandedCategories.has(category.id)}
            isActive={category.isActive}
            onToggle={() => toggleCategory(category.id)}
            onRemove={() => removeCategory(category.id)}
          >
            <>
              {/* First Name */}
              <FormField label="Your First Name">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40"
                  />
                  <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </FormField>

              {/* Last Name */}
              <FormField label="Your Last Name">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40"
                  />
                  <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </FormField>

              {/* Bio Position */}
              <FormField label="Bio Position">
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </FormField>

              {/* Bio Credentials */}
              <FormField label="Bio Credentials">
                <div className="flex items-center gap-3 flex-wrap">
                  {credentials.map((credential, index) => (
                    <Tag key={index} text={credential} />
                  ))}
                </div>
              </FormField>

              {/* Backstory */}
              <FormField label="Backstory">
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {backstory}
                  </p>
                </div>
              </FormField>

              {/* Time Active */}
              <FormField label="Time Active">
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </FormField>

              {/* Before */}
              <FormField label="Before">
                <div className="flex items-center gap-3 flex-wrap">
                  {beforeTags.map((tag, index) => (
                    <Tag key={index} text={tag} />
                  ))}
                </div>
              </FormField>
            </>
          </Category>
        ))}
      </div>
    </div>
  );
};

export default BlueprintForm;

