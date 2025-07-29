"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  Filter,
  Loader2,
  Calendar,
  MoreVertical,
  Star,
  Clock,
  Zap,
  TrendingUp,
  Users,
  Activity,
  FileText,
  Layers,
  Sparkles,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BlueprintProps, deleteBlueprintApi, starBlueprintApi } from "@/services/blueprintApi";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { formatTableDate } from "@/utils/dateUtils";
import useBlueprint from "@/hooks/useBlueprint";

const BlueprintPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blueprintToDelete, setBlueprintToDelete] =
    useState<BlueprintProps | null>(null);

  const { blueprints, isLoading, fetchBlueprint } = useBlueprint();

  const totalPages = Math.ceil(blueprints.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDeleteClick = (blueprint: BlueprintProps) => {
    setBlueprintToDelete(blueprint);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blueprintToDelete) return;

    try {
      await deleteBlueprintApi(blueprintToDelete._id);
      toast.success("Blueprint deleted successfully");
      fetchBlueprint();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleStarToggle = async (blueprint: BlueprintProps) => {
    try {
      await starBlueprintApi(blueprint._id);
      toast.success(blueprint.isStarred ? "Blueprint unstarred" : "Blueprint starred");
      fetchBlueprint();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const BlueprintCard: React.FC<{ blueprint: BlueprintProps }> = ({
    blueprint,
  }) => {
    return (
      <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        {/* Card content */}
        <div className="p-6">
          {/* Header with status and actions */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 
                    onClick={() => router.push(`/dashboard/blueprint/${blueprint._id}`)}
                    className="font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer capitalize text-lg group-hover:text-indigo-600 transition-colors"
                  >
                    {blueprint.title}
                  </h3>
                  {blueprint.isStarred && (
                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                    "Active"
                  )}`}
                >
                  <div className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></div>
                  Active
                </span>
              </div>
            </div>
            
            {/* Actions dropdown */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Blueprint description */}
          <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">
                Template Blueprint
              </span>
            </div>
            <p className="text-xs text-indigo-600 mt-1">
              Ready-to-use template for quick project creation
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatTableDate(blueprint.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTableDate(blueprint.updatedAt)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-indigo-600 font-medium">Premium</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
            <button
              onClick={() => router.push(`/dashboard/blueprint/${blueprint._id}`)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors font-medium"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button 
              onClick={() => handleStarToggle(blueprint)}
              className={`p-2.5 rounded-xl transition-colors ${
                blueprint.isStarred 
                  ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50" 
                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
              }`}
            >
              <Star size={16} fill={blueprint.isStarred ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => handleDeleteClick(blueprint)}
              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredBlueprints = blueprints.filter((blueprint) => {
    const matchesSearch = blueprint.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStarred = !showStarredOnly || blueprint.isStarred;
    return matchesSearch && matchesStarred;
  });

  const paginatedBlueprints = filteredBlueprints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="w-full  mx-auto px-6 py-8">
        {/* Modern Hero Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              <span>Blueprint Management Hub</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-3">
              Blueprint Templates
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create, manage, and deploy powerful blueprint templates for streamlined project development
            </p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <button
              onClick={() => router.push("/dashboard/blueprint/new")}
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Plus size={24} className="relative z-10" />
              <span className="relative z-10">Create New Blueprint</span>
            </button>
          </div>

          {/* Enhanced Search and Filter Bar */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search blueprint templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
                />
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>

              {/* Starred Filter Toggle */}
              <button
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl border transition-colors shadow-sm ${
                  showStarredOnly
                    ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Star size={18} className={showStarredOnly ? "text-yellow-600" : "text-gray-500"} fill={showStarredOnly ? "currentColor" : "none"} />
                <span className="text-sm font-medium">
                  {showStarredOnly ? "Starred Only" : "All Blueprints"}
                </span>
              </button>

            </div>
          </div>

          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{filteredBlueprints.length}</p>
                  <p className="text-sm text-gray-600">Total Templates</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{filteredBlueprints.length}</p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(filteredBlueprints.length * 0.8)}</p>
                  <p className="text-sm text-gray-600">Premium</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredBlueprints.filter((b) => b.isStarred).length}
                  </p>
                  <p className="text-sm text-gray-600">Starred</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                  <div className="h-16 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-3 bg-gray-200 rounded animate-pulse flex-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse flex-1"></div>
                  </div>
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                    <div className="h-10 bg-gray-200 rounded-xl animate-pulse flex-1"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Enhanced Card Grid */}
            {filteredBlueprints.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layers className="w-12 h-12 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No blueprint templates found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or create your first blueprint template to get started
                </p>
                <button
                  onClick={() => router.push("/dashboard/blueprint/new")}
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                >
                  <Plus size={20} />
                  <span>Create First Blueprint</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedBlueprints.map((blueprint) => (
                  <BlueprintCard key={blueprint._id} blueprint={blueprint} />
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {filteredBlueprints.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-12 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                  Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium text-gray-900">
                    {Math.min(currentPage * itemsPerPage, filteredBlueprints.length)}
                  </span>{" "}
                  of <span className="font-medium text-gray-900">{filteredBlueprints.length}</span> blueprints
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <ChevronsLeft size={18} />
                  </button>

                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-xl border border-gray-200">
                    <span className="text-sm text-gray-600">Page</span>
                    <input
                      type="number"
                      value={currentPage}
                      onChange={(e) => setCurrentPage(Number(e.target.value))}
                      className="w-12 px-2 py-1 text-center text-sm border-0 focus:outline-none focus:ring-0 bg-transparent font-medium text-gray-900"
                      min="1"
                      max={totalPages}
                    />
                    <span className="text-sm text-gray-600">
                      of {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <ChevronsRight size={18} />
                  </button>

                  <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
                    <span className="text-sm text-gray-600 font-medium">
                      Items per page:
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-gray-700"
                    >
                      <option value={9}>9</option>
                      <option value={18}>18</option>
                      <option value={27}>27</option>
                      <option value={36}>36</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBlueprintToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Blueprint"
        message={`Are you sure you want to delete "${blueprintToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default BlueprintPage;
