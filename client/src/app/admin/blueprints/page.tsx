"use client";

import React, { useState, useEffect } from "react";
import { adminApi } from "@/services/adminApi";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { Search, User, Star, Calendar } from "lucide-react";

interface Blueprint {
  _id: string;
  title: string;
  description: string;
  offerType: string;
  categories: string[];
  userId:
    | string
    | {
        _id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        createdAt: string;
      };
  isStarred: boolean;
  createdAt: string;
}

export default function BlueprintsPage() {
  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("");

  // Table state
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch blueprints whenever filters/pagination/debouncedSearchTerm changes
  useEffect(() => {
    loadBlueprints();
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    debouncedSearchTerm,
    userFilter,
  ]);

  const loadBlueprints = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getBlueprints(
        pagination.currentPage,
        pagination.itemsPerPage,
        debouncedSearchTerm,
        userFilter
      );
      setBlueprints(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error loading blueprints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) =>
    setPagination((prev) => ({ ...prev, currentPage: page }));
  const handleItemsPerPageChange = (itemsPerPage: number) =>
    setPagination((prev) => ({ ...prev, itemsPerPage, currentPage: 1 }));
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Blueprints Management
          </h1>
          <p className="text-gray-600 mt-2">
            View content blueprints and templates with user profile
            relationships
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search blueprints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <select
                value={userFilter}
                onChange={(e) => {
                  setUserFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Users</option>
                {Array.from(
                  new Set(
                    blueprints.map((b) =>
                      typeof b.userId === "object" ? b.userId._id : b.userId
                    )
                  )
                ).map((userId) => {
                  const user = blueprints.find((b) =>
                    typeof b.userId === "object"
                      ? b.userId._id === userId
                      : b.userId === userId
                  )?.userId;
                  return typeof user === "object" && user ? (
                    <option key={userId} value={userId}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ) : null;
                })}
              </select>
            </div>
          </div>
        </CardHeader>

        {/* Only Results Table Refresh */}
        <BlueprintsResult
          blueprints={blueprints}
          loading={loading}
          pagination={pagination}
          formatDate={formatDate}
          handlePageChange={handlePageChange}
          handleItemsPerPageChange={handleItemsPerPageChange}
        />
      </Card>
    </div>
  );
}

// Separate Component for Results (refresh only this)
const BlueprintsResult = ({
  blueprints,
  loading,
  pagination,
  formatDate,
  handlePageChange,
  handleItemsPerPageChange,
}: any) => {
  return (
    <CardContent>
      {loading ? (
        <div className="py-10 text-center">Loading blueprints...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">
                  Blueprint Title
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  User Profile
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  Blueprint Category
                </th>
                <th className="text-left py-3 px-4 font-medium">Categories</th>
                <th className="text-left py-3 px-4 font-medium">Starred</th>
                <th className="text-left py-3 px-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {blueprints.map((b: Blueprint) => (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{b.title}</div>
                    {b.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {b.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {typeof b.userId === "object" && b.userId ? (
                      <div className="text-sm">
                        <div className="font-medium">
                          {b.userId.firstName} {b.userId.lastName}
                        </div>
                        <div className="text-gray-500 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {b.userId.email}
                        </div>
                        <div className="text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Member since {formatDate(b.userId.createdAt)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">Unknown User</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {b.offerType || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {b.categories.length} categories
                  </td>
                  <td className="py-3 px-4">
                    {b.isStarred ? (
                      <Star className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Star className="h-4 w-4 text-gray-300" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDate(b.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      )}
    </CardContent>
  );
};
