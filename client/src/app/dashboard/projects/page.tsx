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
  FolderOpen,
  Loader2,
  Calendar,
  MoreVertical,
  Star,
  Clock,
  Zap,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteProjectApi, Project } from "@/services/projectApi";
import { getAllBlueprintApi, BlueprintProps } from "@/services/blueprintApi";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { formatTableDate } from "@/utils/dateUtils";
import useProject from "@/hooks/useProject";

const ProjectsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlueprint, setSelectedBlueprint] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [blueprints, setBlueprints] = useState<BlueprintProps[]>([]);
  const [isLoadingBlueprints, setIsLoadingBlueprints] = useState(false);
  const router = useRouter();

  const { isLoading, projects, fetchAllProjects } = useProject();

  // Fetch blueprints on component mount
  React.useEffect(() => {
    const fetchBlueprints = async () => {
      setIsLoadingBlueprints(true);
      try {
        const response = await getAllBlueprintApi();
        if (response.success) {
          setBlueprints(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch blueprints:', error);
        toast.error('Failed to load blueprints');
      } finally {
        setIsLoadingBlueprints(false);
      }
    };

    fetchBlueprints();
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProjectApi(projectToDelete._id);
      toast.success("Project deleted successfully");
      fetchAllProjects();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      {/* Card content */}
      <div className="p-6">
        {/* Header with status and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3
                onClick={() => router.push(`/dashboard/projects/${project._id}`)}
                className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer capitalize text-lg group-hover:text-blue-600 transition-colors"
              >
                {project.name}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                  project.status
                )}`}
              >
                <div className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></div>
                {project.status}
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

        {/* Blueprint info */}
        {project.blueprintId && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="flex items-center space-x-2">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {project.blueprintId.title}
              </span>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatTableDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTableDate(project.updatedAt)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => router.push(`/dashboard/projects/${project._id}`)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors font-medium"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Star size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(project)}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBlueprint =
      selectedBlueprint === "" ||
      selectedBlueprint === "All Blueprints" ||
      project.blueprintId.title === selectedBlueprint;
    return matchesSearch && matchesBlueprint;
  });

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handleBlueprintSelect = (blueprint: BlueprintProps | null) => {
    setSelectedBlueprint(blueprint ? blueprint.title : "");
    setIsDropdownOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full  mx-auto px-6 py-8">
        {/* Modern Hero Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>Project Management Hub</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
              Your Creative Projects
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform ideas into reality with powerful project management tools
            </p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <Link
              role="button"
              href={"/dashboard/projects/new"}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Plus size={24} className="relative z-10" />
              <span className="relative z-10">Create New Project</span>
            </Link>
          </div>

          {/* Enhanced Search and Filter Bar */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search your projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
                />
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>

              {/* Blueprint Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-6 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors min-w-[240px] justify-between shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <FolderOpen size={18} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedBlueprint || "All Blueprints"}
                    </span>
                  </div>
                  {isDropdownOpen ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto mt-2 z-20">
                    {/* All Blueprints option */}
                    <button
                      onClick={() => handleBlueprintSelect(null)}
                      className="w-full px-6 py-4 text-left hover:bg-blue-50 text-gray-700 border-b border-gray-100 text-sm font-medium transition-colors"
                    >
                      All Blueprints
                    </button>
                    {/* Dynamic blueprints */}
                    {isLoadingBlueprints ? (
                      <div className="px-6 py-4 text-gray-500 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                        Loading blueprints...
                      </div>
                    ) : (
                      blueprints.map((blueprint) => (
                        <button
                          key={blueprint._id}
                          onClick={() => handleBlueprintSelect(blueprint)}
                          className="w-full px-6 py-4 text-left hover:bg-blue-50 text-gray-700 border-b border-gray-100 last:border-b-0 text-sm font-medium transition-colors"
                        >
                          {blueprint.title}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{filteredProjects.length}</p>
                  <p className="text-sm text-gray-600">Total Projects</p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredProjects.filter((p) => p.status === "Published").length}
                  </p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredProjects.filter((p) => p.status === "Draft").length}
                  </p>
                  <p className="text-sm text-gray-600">Drafts</p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredProjects.filter((p) => p.status === "Archived").length}
                  </p>
                  <p className="text-sm text-gray-600">Archived</p>
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
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
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
            {filteredProjects.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or create your first project to get started
                </p>
                <Link
                  href="/dashboard/projects/new"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                >
                  <Plus size={20} />
                  <span>Create First Project</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {filteredProjects.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-12 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                  Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium text-gray-900">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredProjects.length
                    )}
                  </span>{" "}
                  of <span className="font-medium text-gray-900">{filteredProjects.length}</span> projects
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-700"
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
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}" ? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ProjectsPage;
