"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Copy,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Filter,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteBlueprintApi, getAllBlueprintApi } from "@/services/blueprintApi";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { formatTableDate } from "@/utils/dateUtils";

interface Blueprint {
  id: string;
  name: string;
  created: string;
  modified: string;
  status: "Active" | "Draft" | "Archived";
}

const BlueprintPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blueprintToDelete, setBlueprintToDelete] = useState<Blueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlueprint();
  }, []);

  const fetchBlueprint = async () => {
    try {
      setIsLoading(true);
      const res = await getAllBlueprintApi();
      setBlueprints(
        res.data.map((blueprint: any) => ({
          id: blueprint._id,
          name: blueprint.title,
          created: blueprint.createdAt,
          modified: blueprint.updatedAt,
          status: "Active",
        }))
      );
      console.log("res", res);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDeleteClick = (blueprint: Blueprint) => {
    setBlueprintToDelete(blueprint);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blueprintToDelete) return;

    try {
      await deleteBlueprintApi(blueprintToDelete.id);
      toast.success("Blueprint deleted successfully");
      fetchBlueprint();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const BlueprintRow: React.FC<{ blueprint: Blueprint }> = ({ blueprint }) => {
    return (
      <tr className="hover:bg-gray-50 border-b border-gray-100">
        <td className="px-6 py-4">
          <div
            onClick={() => router.push(`/dashboard/blueprint/${blueprint.id}`)}
            className="font-medium text-gray-900 capitalize hover:text-blue-600 cursor-pointer max-w-max"
          >
            {blueprint.name}
          </div>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
              blueprint.status
            )}`}
          >
            {blueprint.status}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {formatTableDate(blueprint.created)}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {formatTableDate(blueprint.modified)}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            
            <button
              onClick={() =>
                router.push(`/dashboard/blueprint/${blueprint.id}`)
              }
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(blueprint)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={16} />
            </button>
         
          </div>
        </td>
      </tr>
    );
  };

  const filteredBlueprints = blueprints.filter((blueprint) =>
    blueprint.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedBlueprints = filteredBlueprints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading blueprints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-10/12 mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Blueprints
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and organize your blueprint templates
              </p>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors font-medium"
              onClick={() => router.push("/dashboard/blueprint/new")}
            >
              <Plus size={20} />
              <span>New Blueprint</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search blueprints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
            <span>{filteredBlueprints.length} total blueprints</span>
            <span>
              {filteredBlueprints.filter((b) => b.status === "Active").length}{" "}
              active
            </span>
            <span>
              {filteredBlueprints.filter((b) => b.status === "Draft").length}{" "}
              drafts
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Name</span>
                    {sortOrder === "asc" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedBlueprints.map((blueprint) => (
                <BlueprintRow key={blueprint.id} blueprint={blueprint} />
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredBlueprints.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No blueprints found</div>
              <div className="text-gray-400 text-sm">
                Try adjusting your search criteria
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredBlueprints.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredBlueprints.length)}{" "}
              of {filteredBlueprints.length} results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronsLeft size={16} />
              </button>

              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center space-x-2 px-3">
                <span className="text-sm text-gray-600">Page</span>
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="1"
                  max={totalPages}
                />
                <span className="text-sm text-gray-600">of {totalPages}</span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={16} />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronsRight size={16} />
              </button>

              <div className="flex items-center space-x-2 ml-6 pl-6 border-l border-gray-200">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
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
        message={`Are you sure you want to delete "${blueprintToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default BlueprintPage;
