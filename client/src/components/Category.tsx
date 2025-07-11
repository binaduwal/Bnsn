import { ChevronDown, HelpCircle, X } from "lucide-react";

interface CategoryProps {
  name: string;
  isExpanded?: boolean;
  isActive?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
  children?: React.ReactNode;
}

export const Category: React.FC<CategoryProps> = ({
  name,
  isExpanded = false,
  isActive = false,
  onToggle,
  onRemove,
  children,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 group">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 text-gray-700 font-medium text-base hover:text-gray-900 transition-colors ${
            isActive ? "underline" : ""
          }`}
        >
          <h3 className="text-gray-700 font-medium text-base">{name}</h3>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
        <div title="Blueprint form" className="max-w-max">
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
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
