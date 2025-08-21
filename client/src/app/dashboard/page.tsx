"use client";

import React, { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Copy,
  Edit,
  Trash2,
  Plus,
  Folder,
  FileText,
  Sparkles,
  Clock,
  Star,
  Filter,
  TrendingUp,
  Activity,
  Zap,
  Bookmark,
  Calendar,
  Users,
  Target,
  ArrowRight,
  Grid3X3,
  Layout,
  Palette,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useProject from "@/hooks/useProject";
import useBlueprint from "@/hooks/useBlueprint";
import { Project } from "@/services/projectApi";
import { BlueprintProps } from "@/services/blueprintApi";
import { formatDate } from "@/utils/dateUtils";
import { useAuthStore } from "@/store/authStore";
import { starProjectApi } from "@/services/projectApi";
import { starBlueprintApi } from "@/services/blueprintApi";
import useActivities from "@/hooks/useActivities";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "projects" | "blueprints">(
    "all"
  );
  const router = useRouter();
  const { projects, isLoading: projectFetching, setProjects } = useProject();
  const { blueprints, isLoading, setBlueprints } = useBlueprint();
  const { activities, isLoading: activitiesLoading, fetchActivities } = useActivities(5);
  const { user } = useAuthStore();

  const allItems = [...projects, ...blueprints];
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const activeBlueprints = blueprints.length;

  const handleStarToggle = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking star
    console.log('Star toggle clicked for project:', projectId);
    try {
      setProjects(prev => prev.map(p => p._id === projectId ? { ...p, isStarred: !p.isStarred } : p));
      const result = await starProjectApi(projectId);
      fetchActivities()
      console.log('Star API result:', result);

    } catch (error: any) {
      console.error('Star toggle error:', error);
      toast.error(error.message || 'Failed to update star status');
    }
  };

  const handleBlueprintStarToggle = async (blueprintId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking star
    console.log('Star toggle clicked for blueprint:', blueprintId);
    try {
      setBlueprints(prev => prev.map(b => b._id === blueprintId ? { ...b, isStarred: !b.isStarred } : b));

      const result = await starBlueprintApi(blueprintId);
      console.log('Blueprint star API result:', result);
      // Refresh the blueprints list
      fetchActivities()
    } catch (error: any) {
      console.error('Blueprint star toggle error:', error);
      toast.error(error.message || 'Failed to update star status');
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_created':
      case 'project_updated':
      case 'project_deleted':
        return <Folder className="w-4 h-4 text-blue-600" />;
      case 'project_starred':
        return <Star className="w-4 h-4 text-amber-600" />;
      case 'blueprint_created':
      case 'blueprint_updated':
      case 'blueprint_deleted':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'blueprint_starred':
        return <Star className="w-4 h-4 text-amber-600" />;
      case 'project_generated':
        return <Zap className="w-4 h-4 text-green-600" />;
      case 'blueprint_cloned':
        return <Copy className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'project_created':
      case 'project_updated':
      case 'project_deleted':
        return 'bg-blue-100';
      case 'project_starred':
        return 'bg-amber-100';
      case 'blueprint_created':
      case 'blueprint_updated':
      case 'blueprint_deleted':
        return 'bg-indigo-100';
      case 'blueprint_starred':
        return 'bg-amber-100';
      case 'project_generated':
        return 'bg-green-100';
      case 'blueprint_cloned':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div
      onClick={() => router.push(`/dashboard/projects/${project._id}`)}
      className="group bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-gray-200/60 p-6 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-50"></div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Folder className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold capitalize text-gray-900 group-hover:text-blue-700 transition-colors">
                {project.name}
              </h3>
              <button
                onClick={(e) => {
                  handleStarToggle(project._id, e);
                }}
                className="p-1 hover:bg-amber-50 rounded-full transition-colors border border-red-200"
                style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}
              >
                <Star className={`w-4 h-4 ${project.isStarred ? 'text-amber-500 fill-current' : 'text-gray-400 hover:text-amber-500'}`} />
              </button>
            </div>
            <p className="text-sm text-blue-600 font-medium flex items-center">
              <Target className="w-3 h-3 mr-1" />
              Project
            </p>
          </div>
        </div>
        {/* <div className="flex items-center space-x-1  transition-opacity">
         
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit size={16} />
          </button>
        </div> */}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Updated {formatDate(project.updatedAt)}</span>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              project.status || "Active"
            )}`}
          >
            {project.status || "Active"}
          </span>
        </div>


      </div>
    </div>
  );

  const BlueprintCard: React.FC<{ blueprint: BlueprintProps }> = ({
    blueprint,
  }) => (
    <div
      onClick={() => router.push(`/dashboard/blueprint/${blueprint._id}`)}
      className="group bg-gradient-to-br from-white to-indigo-50/30 rounded-xl border border-gray-200/60 p-6 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300  cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100 to-transparent rounded-bl-full opacity-50"></div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold capitalize text-gray-900 group-hover:text-indigo-700 transition-colors">
                {blueprint.title}
              </h3>
              <button
                onClick={(e) => {
                  handleBlueprintStarToggle(blueprint._id, e);
                }}
                className="p-1 hover:bg-amber-50 rounded-full transition-colors border border-red-200"
                style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}
              >
                <Star className={`w-4 h-4 ${blueprint.isStarred ? 'text-amber-500 fill-current' : 'text-gray-400 hover:text-amber-500'}`} />
              </button>
            </div>
            <p className="text-sm text-indigo-600 font-medium flex items-center">
              <Layout className="w-3 h-3 mr-1" />
              Blueprint
            </p>
          </div>
        </div>

      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Updated {formatDate(blueprint.updatedAt)}</span>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              "Active"
            )}`}
          >
            Active
          </span>
        </div>


      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Welcome back, {user?.firstName || 'User'}! 👋
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Ready to build something amazing today?
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                role="button"
                href={"/dashboard/blueprint/new"}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-5 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <FileText size={18} />
                <span>New Blueprint</span>
              </Link>
              <Link
                role="button"
                href={"/dashboard/projects/new"}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <Folder size={18} />
                <span>New Project</span>
              </Link>

              <Link
                role="button"
                href={"/dashboard/cloner"}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-5 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Copy size={18} />
                <Sparkles size={18} />
                <span>Quick Clone</span>
              </Link>
            </div>
          </div>


          {/* Enhanced Search and Filter Bar */}
          <div className="flex items-center space-x-4 mb-6">
            {/* <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search projects, blueprints, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <div className="absolute right-4 top-1/2 flex justify-center items-center cursor-pointer p-1 size-6 hover:bg-gray-200 duration-200  rounded-full  transform -translate-y-1/2">
                <X onClick={() => setSearchQuery("")}
                  className="   text-gray-700"
                  size={20}
                />
              </div>
             
            </div> */}
            {/* <button className="flex items-center space-x-2 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md">
              <Filter size={18} />
              <span className="font-medium">Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
              <TrendingUp size={18} />
              <span>Sort</span>
            </button> */}
          </div>

          {/* Filter Tabs */}
          <div className=" flex items-center  justify-between mb-7 ">

            <div className="flex items-center space-x-1 ">
              {[
                { key: "all", label: "All Items", count: allItems.length },
                { key: "projects", label: "Projects", count: projects.length },
                {
                  key: "blueprints",
                  label: "Blueprints",
                  count: blueprints.length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg border border-transparent text-sm font-medium transition-colors ${activeTab === tab.key
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search projects, blueprints, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl bg-white outline-none "
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              {searchQuery.trim() && <div onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 flex justify-center items-center cursor-pointer p-1 size-6 hover:bg-gray-200 duration-200  rounded-full  transform -translate-y-1/2">
                <X
                  className="   text-gray-700"
                  size={20}
                />
              </div>}

            </div>
          </div>
          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {activeProjects}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    {projects.filter(p => p.status === 'Active').length} active
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Active Projects</h3>
                <div className="w-full bg-blue-200/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{
                      width: `${activeProjects > 0 ? (activeProjects / projects.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-6 rounded-2xl border border-indigo-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {activeBlueprints}
                  </div>
                  <div className="text-xs text-indigo-600 font-medium">
                    {blueprints.filter(b => b.isStarred).length} starred
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Active Blueprints</h3>
                <div className="w-full bg-indigo-200/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${activeBlueprints > 0 ? (blueprints.filter(b => b.isStarred).length / blueprints.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {projects.filter(p => p.status === 'Draft').length}
                  </div>
                  <div className="text-xs text-amber-600 font-medium">In progress</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Draft Projects</h3>
                <div className="w-full bg-amber-200/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
                    style={{
                      width: `${activeProjects > 0 ? (projects.filter(p => p.status === 'Draft').length / projects.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {projects.filter(p => p.isStarred).length + blueprints.filter(b => b.isStarred).length}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">Favorites</div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Starred Items</h3>
                <div className="w-full bg-emerald-200/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                    style={{
                      width: `${allItems.length > 0 ? ((projects.filter(p => p.isStarred).length + blueprints.filter(b => b.isStarred).length) / allItems.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {searchQuery || activeTab !== "all" ? (
          <div className="space-y-6">
            {(() => {
              const filteredProjects = searchQuery
                ? projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                : activeTab === "projects"
                  ? projects
                  : [];

              const filteredBlueprints = searchQuery
                ? blueprints.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
                : activeTab === "blueprints"
                  ? blueprints
                  : [];

              const totalItems = filteredProjects.length + filteredBlueprints.length;

              return (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {searchQuery
                        ? `Search Results (${totalItems})`
                        : activeTab === "projects"
                          ? "All Projects"
                          : "All Blueprints"}
                    </h2>
                    <div className="text-sm text-gray-600">{totalItems} items found</div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map((item, i) => (
                      <ProjectCard key={i} project={item} />
                    ))}

                    {filteredBlueprints.map((item, i) => (
                      <BlueprintCard key={i} blueprint={item} />
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Projects and Blueprints */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Projects */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Folder className="w-5 h-5 text-white" />
                    </div>
                    <span>Recent Projects</span>
                  </h2>
                  <button
                    onClick={() => router.push("/dashboard/projects")}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-600 mb-4">Create your first project to get started</p>
                      <Link
                        href="/dashboard/projects/new"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={16} />
                        <span>Create Project</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Blueprints */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span>Recent Blueprints</span>
                  </h2>
                  <button
                    onClick={() => router.push("/dashboard/blueprint")}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all duration-200 flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {blueprints.slice(0, 5).map((blueprint) => (
                    <BlueprintCard key={blueprint._id} blueprint={blueprint} />
                  ))}
                  {blueprints.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No blueprints yet</h3>
                      <p className="text-gray-600 mb-4">Create your first blueprint template</p>
                      <Link
                        href="/dashboard/blueprint/new"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Plus size={16} />
                        <span>Create Blueprint</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Recent Activity Feed */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span>Recent Activities</span>
                  </h3>

                </div>
                <div className="space-y-4">
                  {activitiesLoading ? (
                    // Loading skeleton
                    [...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-4 p-3 rounded-lg">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>
                    ))
                  ) : activities.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No recent activity</p>
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity._id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-8 h-8 ${getActivityBgColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
