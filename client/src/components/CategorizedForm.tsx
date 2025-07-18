"use client";
import { CategoryValue } from "@/services/blueprintApi";
import React, { useEffect, useState } from "react";

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

type FormData = Record<string, Record<string, any>>;

interface CategoryFormProps {
  categories: Category[];
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
  onCategorySubmit,
  categoryValues,
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );

  useEffect(() => {
    const initialFormData: FormData = {};

    categories.forEach((category) => {
      const matchedCategoryValue = categoryValues.find(
        (cv) => cv.category === category._id
      );

      if (matchedCategoryValue) {
        const fieldMap: Record<string, any> = {};

        category.fields.forEach((field) => {
          const matchedField = matchedCategoryValue.value.find(
            (val) => val.key === field.fieldName
          );

          if (matchedField) {
            fieldMap[field._id] = matchedField.value;
          }
        });

        initialFormData[category._id] = fieldMap;
      }
    });

    setFormData(initialFormData);
  }, [categories, categoryValues]);
  const handleInputChange = (
    categoryId: string,
    fieldId: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [fieldId]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors[categoryId]?.[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [fieldId]: "",
        },
      }));
    }
  };

  const validateCategory = (category: Category): boolean => {
    const newErrors: Record<string, string> = {};
    const categoryData = formData[category._id] || {};

    category.fields.forEach((field) => {
      const value = categoryData[field._id];

      if (!value || (typeof value === "string" && value.trim() === "")) {
        newErrors[field._id] = `${field.fieldName} is required`;
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

  const handleCategorySubmit = (category: Category) => {
    if (validateCategory(category)) {
      const categoryData = formData[category._id] || {};
      onCategorySubmit?.(category._id, categoryData);
      console.log("Category submitted:", {
        categoryId: category._id,
        formData: categoryData,
      });
    }
  };

  const handleSubmitAll = () => {
    if (validateAllCategories()) {
      onSubmit?.(formData);
      console.log("All forms submitted:", formData);
    }
  };

  const resetCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      [categoryId]: {},
    }));
    setErrors((prev) => ({
      ...prev,
      [categoryId]: {},
    }));
  };

  const resetAll = () => {
    setFormData({});
    setErrors({});
  };

  const renderField = (category: Category, field: Field) => {
    const value = formData[category._id]?.[field._id] || "";
    const hasError = errors[category._id]?.[field._id];

    const baseInputClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

    switch (field.fieldType.toLowerCase()) {
      case "text":
      case "string":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              handleInputChange(category._id, field._id, e.target.value)
            }
            className={baseInputClasses}
            placeholder={`Enter ${field.fieldName.toLowerCase()}`}
          />
        );

      case "email":
        return (
          <input
            type="email"
            value={value}
            onChange={(e) =>
              handleInputChange(category._id, field._id, e.target.value)
            }
            className={baseInputClasses}
            placeholder={`Enter ${field.fieldName.toLowerCase()}`}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              handleInputChange(category._id, field._id, e.target.value)
            }
            className={baseInputClasses}
            placeholder={`Enter ${field.fieldName.toLowerCase()}`}
          />
        );

      case "password":
        return (
          <input
            type="password"
            value={value}
            onChange={(e) =>
              handleInputChange(category._id, field._id, e.target.value)
            }
            className={baseInputClasses}
            placeholder={`Enter ${field.fieldName.toLowerCase()}`}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) =>
              handleInputChange(category._id, field._id, e.target.value)
            }
            className={`${baseInputClasses} min-h-[100px] resize-vertical`}
            placeholder={`Enter ${field.fieldName.toLowerCase()}`}
            rows={4}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) =>
              handleInputChange(category._id, field._id, e.target.value)
            }
            className={baseInputClasses}
          >
            <option value="">Select {field.fieldName.toLowerCase()}</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) =>
                handleInputChange(category._id, field._id, e.target.checked)
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              {field.fieldName}
            </label>
          </div>
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) =>
              handleInputChange(category._id, field._id, e.target.value)
            }
            className={baseInputClasses}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              handleInputChange(category._id, field._id, e.target.value)
            }
            className={baseInputClasses}
            placeholder={`Enter ${field.fieldName.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Blueprint</h1>
        {/* <p className="text-gray-600">
          Fill out the forms below. You can submit individual categories or all
          at once.
        </p> */}
      </div>

      {/* Global Actions */}

      {/* Category Forms */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-gray-50 rounded-lg p-6 border border-gray-200"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {category.title}
              </h2>
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
    </div>
  );
};
