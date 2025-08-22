"use client";

import React, { useState, useEffect } from "react";
import { adminApi } from "@/services/adminApi";
import { Card, CardContent } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { Search, Filter, User, Star, Calendar } from "lucide-react";

interface UserType {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: "Active" | "Draft" | "Archived";
  isStarred: boolean;
  userId: string | UserType;
  createdAt: string;
}

export default function ProjectsPage() {
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("");

  // Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserType[]>([]); // keep full user list
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch projects when filters/pagination change
  useEffect(() => {
    loadProjects();
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    debouncedSearchTerm,
    statusFilter,
    userFilter,
  ]);

  // Fetch users only once
  useEffect(() => {
    loadUsers();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getProjects(
        pagination.currentPage,
        pagination.itemsPerPage,
        debouncedSearchTerm,
        statusFilter,
        userFilter
      );
      setProjects(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminApi.getUsers(); // 👈 create an endpoint that returns all users
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination((prev) => ({ ...prev, itemsPerPage, currentPage: 1 }));
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* User filter */}
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
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading projects...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">
                      Project Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      User Profile
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Starred</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{project.name}</div>
                        {project.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {project.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {typeof project.userId === "object" &&
                        project.userId ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {project.userId.firstName}{" "}
                              {project.userId.lastName}
                            </div>
                            <div className="text-gray-500 flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {project.userId.email}
                            </div>
                            <div className="text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Member since{" "}
                              {formatDate(project.userId.createdAt)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500">Unknown User</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {project.isStarred ? (
                          <Star className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <Star className="h-4 w-4 text-gray-300" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatDate(project.createdAt)}
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
      </Card>
    </div>
  );
}
