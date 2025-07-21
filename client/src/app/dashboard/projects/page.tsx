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
  FolderOpen,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteProjectApi, getAllProjectApi, Project } from "@/services/projectApi";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { formatTableDate } from "@/utils/dateUtils";



const ProjectsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlueprint, setSelectedBlueprint] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchAllProjects()
  }, [])

  const fetchAllProjects = async () =>{
    setIsLoading(true);
    try {
      const res = await getAllProjectApi()
      setProjects(res.data)
    } catch (error:any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  }

  const blueprints = [
    "All Blueprints",
    "Viral Content Engine for Women's Activewear",
    "AI Agency Accelerator",
    "Your Best Life",
    "Dr. Hoyos Medical Office",
    "Outreach for business owners to sell their company",
  ];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProjectApi(projectToDelete._id);
      toast.success("Project deleted successfully");
      fetchAllProjects();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

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

  const ProjectRow: React.FC<{ project: Project }> = ({ project }) => (
    <tr className="hover:bg-gray-50 border-b border-gray-100">
      <td className="px-6 py-4">
        <div
          onClick={() => router.push(`/dashboard/projects/${project._id}`)}
          className="font-medium text-gray-900 hover:text-blue-600 capitalize cursor-pointer max-w-max"
        >
          {project.name}
        </div>
        {project.blueprintId && (
          <div className="text-sm text-gray-500 mt-1">
            Blueprint: {project.blueprintId.title}
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{formatTableDate(project.createdAt)}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{formatTableDate(project.updatedAt)}</td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
        
          <button
            onClick={() => router.push(`/dashboard/projects/${project._id}`)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit size={16} />
          </button>
          <button onClick={() => handleDeleteClick(project)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
            <Trash2 size={16} />
          </button>

        </div>
      </td>
    </tr>
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

  const handleBlueprintSelect = (blueprint: string) => {
    setSelectedBlueprint(blueprint === "All Blueprints" ? "" : blueprint);
    setIsDropdownOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-10/12 mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage and organize your project instances
              </p>
            </div>
            <Link
              role="button"
              href={"/dashboard/projects/new"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>New Project</span>
            </Link>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            {/* Blueprint Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px] justify-between"
              >
                <div className="flex items-center space-x-2">
                  <FolderOpen size={16} />
                  <span className="text-sm">
                    {selectedBlueprint || "All Blueprints"}
                  </span>
                </div>
                {isDropdownOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto mt-1">
                  {blueprints.map((blueprint, index) => (
                    <button
                      key={index}
                      onClick={() => handleBlueprintSelect(blueprint)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 border-b border-gray-100 last:border-b-0 text-sm"
                    >
                      {blueprint}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
            <span>{filteredProjects.length} total projects</span>
            <span>
              {filteredProjects.filter((p) => p.status === "Published").length}{" "}
              active
            </span>
            <span>
              {filteredProjects.filter((p) => p.status === "Draft").length}{" "}
              drafts
            </span>
            <span>
              {filteredProjects.filter((p) => p.status === "Archived").length}{" "}
              archived
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <Loader2 className="animate-spin text-blue-600" size={24} />
                <span className="text-gray-600">Loading projects...</span>
              </div>
            </div>
          </div>
        ) : (
          <>
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
                  {paginatedProjects.map((project) => (
                    <ProjectRow key={project._id} project={project} />
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-2">No projects found</div>
                  <div className="text-gray-400 text-sm">
                    Try adjusting your search or filter criteria
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredProjects.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of{" "}
                  {filteredProjects.length} results
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
