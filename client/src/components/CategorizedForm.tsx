"use client";
import { CategoryValue, updateCategoryValueApi } from "@/services/blueprintApi";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type Category = {
  _id: string;
  title: string;
  fields: Field[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  type: string;
};

export type Field = {
  fieldName: string;
  fieldType: string;
  _id: string;
};

type FormData = Record<string, Record<string, any[]>>;
type EditingState = Record<
  string,
  Record<string, { isEditing: boolean; tempValue: string }>
>;

interface CategoryFormProps {
  categories: Category[];
  loading?: boolean;
  categoryValues: CategoryValue[];
  onSubmit?: (allFormData: FormData) => void;
  onCategorySubmit?: (
    categoryId: string,
    formData: Record<string, any>
  ) => void;
}

export const CategorizedForm: React.FC<CategoryFormProps> = ({
  categories,
  onSubmit,
  loading,
  onCategorySubmit,
  categoryValues,
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const [editingState, setEditingState] = useState<EditingState>({});
  const [inlineEditingState, setInlineEditingState] = useState<
    Record<
      string,
      Record<
        string,
        { isEditing: boolean; tempValue: string; editingIndex: number }
      >
    >
  >({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const initialFormData: FormData = {};

    categories.forEach((category) => {
      const matchedCategoryValue = categoryValues.find(
        (cv) => cv.category === category._id
      );

      if (matchedCategoryValue) {
        const fieldMap: Record<string, any[]> = {};

        category.fields.forEach((field) => {
          const matchedField = matchedCategoryValue.value.find(
            (val) => val.key === field.fieldName
          );

          if (matchedField) {
            // Try to parse as JSON first, then fallback to comma-separated string
            let fieldValues: any[] = [];
            try {
              // Check if the value is a JSON string (array)
              const parsed =
                typeof matchedField.value == "string"
                  ? JSON.parse(matchedField.value)
                  : matchedField.value;
              if (Array.isArray(parsed)) {
                fieldValues = parsed;
              } else {
                // If it's not an array, treat as single value
                fieldValues = [matchedField.value];
              }
            } catch {
              // If JSON parsing fails, split by comma and trim
              fieldValues =
                typeof matchedField.value === "string"
                  ? matchedField.value
                      .split(",")
                      .map((v: string) => v.trim())
                      .filter(Boolean)
                  : matchedField.value;
            }

            fieldMap[field._id] = fieldValues;
          } else {
            fieldMap[field._id] = [];
          }
        });

        initialFormData[category._id] = fieldMap;
      } else {
        // Initialize empty arrays for fields without values
        const fieldMap: Record<string, any[]> = {};
        category.fields.forEach((field) => {
          fieldMap[field._id] = [];
        });
        initialFormData[category._id] = fieldMap;
      }
    });

    setFormData(initialFormData);
  }, [categories, categoryValues]);

  const handleAddValue = (categoryId: string, fieldId: string) => {
    setEditingState((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [fieldId]: { isEditing: true, tempValue: "" },
      },
    }));
  };

  const handleSaveValue = (categoryId: string, fieldId: string) => {
    const currentEditing = editingState[categoryId]?.[fieldId];
    if (currentEditing && currentEditing.tempValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [fieldId]: [
            ...(prev[categoryId]?.[fieldId] || []),
            currentEditing.tempValue,
          ],
        },
      }));

      // Clear editing state
      setEditingState((prev) => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [fieldId]: { isEditing: false, tempValue: "" },
        },
      }));
    }
  };

  const handleCancelEdit = (categoryId: string, fieldId: string) => {
    setEditingState((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [fieldId]: { isEditing: false, tempValue: "" },
      },
    }));
  };

  const handleRemoveValue = (
    categoryId: string,
    fieldId: string,
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [fieldId]:
          prev[categoryId]?.[fieldId]?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const handleTempValueChange = (
    categoryId: string,
    fieldId: string,
    value: string
  ) => {
    setEditingState((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [fieldId]: { isEditing: true, tempValue: value },
      },
    }));
  };

  const validateCategory = (category: Category): boolean => {
    const newErrors: Record<string, string> = {};
    const categoryData = formData[category._id] || {};

    category.fields.forEach((field) => {
      const values = categoryData[field._id] || [];

      if (values.length === 0) {
        newErrors[field._id] = `${field.fieldName} is required`;
      }

      // Validate each value
      values.forEach((value, index) => {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[field._id] = `${field.fieldName} value ${
            index + 1
          } is required`;
        }

        if (field.fieldType === "email" && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors[field._id] = "Please enter a valid email address";
          }
        }

        if (field.fieldType === "number" && value && isNaN(Number(value))) {
          newErrors[field._id] = "Please enter a valid number";
        }
      });
    });

    setErrors((prev) => ({
      ...prev,
      [category._id]: newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const validateAllCategories = (): boolean => {
    let allValid = true;

    categories.forEach((category) => {
      if (!validateCategory(category)) {
        allValid = false;
      }
    });

    return allValid;
  };

  const handleInlineEdit = (
    categoryId: string,
    fieldId: string,
    index: number,
    currentValue: string
  ) => {
    setInlineEditingState((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [fieldId]: {
          isEditing: true,
          tempValue: currentValue,
          editingIndex: index,
        },
      },
    }));
  };

  const handleInlineSave = (categoryId: string, fieldId: string) => {
    const currentEditing = inlineEditingState[categoryId]?.[fieldId];
    if (currentEditing && currentEditing.tempValue.trim()) {
      setFormData((prev) => {
        const newValues = [...(prev[categoryId]?.[fieldId] || [])];
        newValues[currentEditing.editingIndex] = currentEditing.tempValue;

        return {
          ...prev,
          [categoryId]: {
            ...prev[categoryId],
            [fieldId]: newValues,
          },
        };
      });

      // Clear editing state
      setInlineEditingState((prev) => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [fieldId]: { isEditing: false, tempValue: "", editingIndex: -1 },
        },
      }));
    }
  };

  const handleInlineCancel = (categoryId: string, fieldId: string) => {
    setInlineEditingState((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [fieldId]: { isEditing: false, tempValue: "", editingIndex: -1 },
      },
    }));
  };

  const handleInlineValueChange = (
    categoryId: string,
    fieldId: string,
    value: string
  ) => {
    setInlineEditingState((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [fieldId]: {
          ...prev[categoryId]?.[fieldId],
          tempValue: value,
        },
      },
    }));
  };

  const handleUpdateCategoryValue = async (categoryId: string) => {
    const categoryValue = categoryValues.find(
      (cv) => cv.category === categoryId
    );
    if (!categoryValue) {
      toast.error("Category value not found");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [categoryId]: true }));

    try {
      const categoryData = formData[categoryId] || {};
      const category = categories.find((c) => c._id === categoryId);

      if (!category) {
        toast.error("Category not found");
        return;
      }

      // Convert form data back to the expected API format
      const valueArray = category.fields.map((field) => {
        const fieldValues = categoryData[field._id] || [];
        return {
          key: field.fieldName,
          value: fieldValues, // Store as JSON string to preserve array structure
        };
      });

      await updateCategoryValueApi(categoryValue._id, valueArray);
      toast.success("Category updated successfully");

      // Optionally refresh the data
      if (onCategorySubmit) {
        onCategorySubmit(categoryId, categoryData);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const renderField = (category: Category, field: Field) => {
    const values = formData[category._id]?.[field._id] || [];
    const hasError = errors[category._id]?.[field._id];
    const isEditing =
      editingState[category._id]?.[field._id]?.isEditing || false;
    const tempValue = editingState[category._id]?.[field._id]?.tempValue || "";
    const inlineEditing = inlineEditingState[category._id]?.[field._id];
    const isLoading = loadingStates[category._id];

    const baseInputClasses = `min-w-64 px-3 py-2 pr-16 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

    return (
      <div className="space-y-2">
        {/* Existing values in row */}
        <div className="flex items-center gap-2 flex-wrap">
          {values.map((value, index) => (
            <div key={index} className="relative">
              {inlineEditing?.isEditing &&
              inlineEditing.editingIndex === index ? (
                <input
                  type="text"
                  value={inlineEditing.tempValue}
                  onChange={(e) =>
                    handleInlineValueChange(
                      category._id,
                      field._id,
                      e.target.value
                    )
                  }
                  className={baseInputClasses}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  readOnly
                  className={`${baseInputClasses} bg-gray-50 cursor-pointer hover:bg-gray-100`}
                  onDoubleClick={() =>
                    handleInlineEdit(category._id, field._id, index, value)
                  }
                />
              )}

              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5">
                {inlineEditing?.isEditing &&
                inlineEditing.editingIndex === index ? (
                  <>
                    <button
                      onClick={() => handleInlineSave(category._id, field._id)}
                      className="p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      title="Save"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        handleInlineCancel(category._id, field._id)
                      }
                      className="p-1.5 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                      title="Cancel"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        handleInlineEdit(category._id, field._id, index, value)
                      }
                      className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors"
                      title="Edit"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        handleRemoveValue(category._id, field._id, index)
                      }
                      className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                      title="Remove value"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Add new value section */}
          {isEditing ? (
            <div className="relative">
              <input
                type="text"
                value={tempValue}
                onChange={(e) =>
                  handleTempValueChange(category._id, field._id, e.target.value)
                }
                className={baseInputClasses}
                placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                autoFocus
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5">
                <button
                  onClick={() => handleSaveValue(category._id, field._id)}
                  className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="Save"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleCancelEdit(category._id, field._id)}
                  className="p-1.5 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                  title="Cancel"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleAddValue(category._id, field._id)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              title="Add new value"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Blueprint</h1>
      </div>

      {/* Category Forms */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader className="size-9 text-blue-500 animate-spin" />
        </div>
      ) : !loading && categories.length > 0 ? (
        <div className="space-y-8">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200"
            >
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {category.title}
                </h2>

                {/* Check/Update Button */}
                <button
                  onClick={() => handleUpdateCategoryValue(category._id)}
                  disabled={loadingStates[category._id]}
                  className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                    loadingStates[category._id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {loadingStates[category._id] ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Update
                    </div>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {category.fields.map((field) => (
                  <div key={field._id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.fieldName}
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    {renderField(category, field)}

                    {errors[category._id]?.[field._id] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[category._id][field._id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              No categories found.
            </h1>
            <p className="text-gray-600 mb-6">
              Please create a category to proceed.
            </p>
            {/* <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Category
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};
