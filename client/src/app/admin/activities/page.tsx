"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/services/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { Search, Filter, Calendar, User, Activity } from "lucide-react";

interface Activity {
  _id: string;
  userId:
    | string
    | {
        _id: string;
        email: string;
        firstName?: string;
        lastName?: string;
      };
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

// Activity list component (partial re-render)
const ActivityList = ({
  activities,
  getActionColor,
  formatDate,
}: {
  activities: Activity[];
  getActionColor: (action: string) => string;
  formatDate: (date: string) => string;
}) => (
  <div className="space-y-4">
    {activities.map((activity) => (
      <div
        key={activity._id}
        className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50"
      >
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                  activity.type || ""
                )}`}
              >
                {activity.type || "Unknown"}
              </span>
              <span className="text-sm text-gray-500">
                {typeof activity.userId === "string"
                  ? "Unknown User"
                  : `${activity.userId.firstName || ""} ${
                      activity.userId.lastName || ""
                    }`.trim() || "Unknown User"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(activity.createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{activity.title}</p>
          {typeof activity.userId === "object" && activity.userId && (
            <p className="text-xs text-gray-500 mt-1">
              {activity.userId.email}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [allActions, setAllActions] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 25,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load activities from API
  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getActivities(
        pagination.currentPage,
        pagination.itemsPerPage,
        actionFilter,
        debouncedSearch
      );

      setActivities(response.data);
      setPagination(response.pagination);

      // Populate all action types for filter if not already set
      if (allActions.length === 0) {
        const uniqueActions = [...new Set(response.data.map((a) => a.type))];
        setAllActions(uniqueActions);
      }
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    actionFilter,
    debouncedSearch,
    allActions.length,
  ]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination((prev) => ({ ...prev, itemsPerPage, currentPage: 1 }));
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleActionFilter = (action: string) => {
    setActionFilter(action);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "login":
        return "bg-green-100 text-green-800";
      case "logout":
        return "bg-gray-100 text-gray-800";
      case "create":
        return "bg-blue-100 text-blue-800";
      case "update":
        return "bg-yellow-100 text-yellow-800";
      case "delete":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUniqueActions = () => allActions;

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">
              Total Activities
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">All time activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Activities
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                activities.filter(
                  (a) =>
                    new Date(a.createdAt).toDateString() ===
                    new Date().toDateString()
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Activities today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                new Set(
                  activities.map((a) =>
                    typeof a.userId === "string" ? a.userId : a.userId._id
                  )
                ).size
              }
            </div>
            <p className="text-xs text-muted-foreground">Unique users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Action Types</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getUniqueActions().length}
            </div>
            <p className="text-xs text-muted-foreground">Different actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search Projects or Activities"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={actionFilter}
                onChange={(e) => handleActionFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {getUniqueActions().map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading activities...</div>
          ) : (
            <ActivityList
              activities={activities}
              getActionColor={getActionColor}
              formatDate={formatDate}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
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
  );
}
