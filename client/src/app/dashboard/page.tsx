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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  type: "project" | "blueprint";
  lastModified?: string;
  created?: string;
  status?: "Active" | "Draft" | "Archived";
  isStarred?: boolean;
}

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "projects" | "blueprints">(
    "all"
  );
  const router = useRouter();

  const projects: Project[] = [
    {
      id: "1",
      name: "Test with ecom",
      type: "project",
      lastModified: "2024-07-08",
      created: "2024-07-06",
      status: "Active",
      isStarred: true,
    },
    {
      id: "2",
      name: "Test",
      type: "project",
      lastModified: "2024-07-07",
      created: "2024-07-06",
      status: "Draft",
    },
    {
      id: "3",
      name: "Ai Assisted Agency Accelerator",
      type: "project",
      lastModified: "2024-07-05",
      created: "2024-07-02",
      status: "Active",
      isStarred: true,
    },
    {
      id: "4",
      name: "Ai Assisted Agency Accelerator",
      type: "project",
      lastModified: "2024-07-01",
      created: "2024-06-25",
      status: "Active",
    },
    {
      id: "5",
      name: "Ai Assisted® Agency Accelerator",
      type: "project",
      lastModified: "2024-06-24",
      created: "2024-06-20",
      status: "Archived",
    },
  ];

  const blueprints: Project[] = [
    {
      id: "1",
      name: "Viral Content Engine for Women's Activewear (Copy)",
      type: "blueprint",
      lastModified: "2024-07-08",
      created: "2024-07-03",
      status: "Active",
      isStarred: true,
    },
    {
      id: "2",
      name: "Viral Content Engine for Women's Activewear",
      type: "blueprint",
      lastModified: "2024-07-07",
      created: "2024-07-06",
      status: "Active",
    },
    {
      id: "3",
      name: "AI Agency Accelerator",
      type: "blueprint",
      lastModified: "2024-07-04",
      created: "2024-06-30",
      status: "Draft",
    },
    {
      id: "4",
      name: "Your Best Life",
      type: "blueprint",
      lastModified: "2024-07-01",
      created: "2024-06-25",
      status: "Active",
    },
    {
      id: "5",
      name: "Dr. Hoyos Medical Office",
      type: "blueprint",
      lastModified: "2024-06-24",
      created: "2024-06-20",
      status: "Archived",
    },
  ];

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
    <div
      onClick={() => router.push(`/dashboard/projects/${project.name}`)}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Folder className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900">
                {project.name}
              </h3>
              {project.isStarred && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-sm text-gray-500 capitalize">{project.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Copy size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Edit size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
            <Trash2 size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Modified {project.lastModified}</span>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
            project.status || "Active"
          )}`}
        >
          {project.status || "Active"}
        </span>
      </div>
    </div>
  );

  const BlueprintCard: React.FC<{ blueprint: Project }> = ({ blueprint }) => (
    <div
      onClick={() => router.push(`/dashboard/blueprint/${blueprint.name}`)}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900">
                {blueprint.name}
              </h3>
              {blueprint.isStarred && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-sm text-gray-500 capitalize">{blueprint.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Copy size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Edit size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
            <Trash2 size={16} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Modified {blueprint.lastModified}</span>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
            blueprint.status || "Active"
          )}`}
        >
          {blueprint.status || "Active"}
        </span>
      </div>
    </div>
  );

  const allItems = [...projects, ...blueprints];
  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" || item.type === activeTab.slice(0, -1);
    return matchesSearch && matchesTab;
  });

  const activeProjects = projects.filter((p) => p.status === "Active").length;
  const draftProjects = projects.filter((p) => p.status === "Draft").length;
  const activeBlueprints = blueprints.filter(
    (b) => b.status === "Active"
  ).length;
  const draftBlueprints = blueprints.filter((b) => b.status === "Draft").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-10/12 mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Welcome back, Kane!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your projects and blueprints
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                role="button"
                href={"/dashboard/projects/new"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors font-medium"
              >
                <Plus size={20} />
                <Folder size={20} />
                <span>New Project</span>
              </Link>
              <Link
                role="button"
                href={"/dashboard/blueprint/new"}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors font-medium"
              >
                <Plus size={20} />
                <FileText size={20} />
                <span>New Blueprint</span>
              </Link>
              <Link
                role="button"
                href={"/dashboard/cloner"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors font-medium"
              >
                <Plus size={20} />
                <Copy size={20} />
                <span>New Clone</span>
              </Link>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search projects and blueprints..."
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

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 mb-6">
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
                className={`px-4 py-2 rounded-lg border border-transparent text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Folder className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  Active Projects
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {activeProjects}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-600">
                  Active Blueprints
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {activeBlueprints}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-600">
                  Draft Projects
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {draftProjects}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">
                  Starred Items
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {allItems.filter((item) => item.isStarred).length}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {searchQuery || activeTab !== "all" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                {searchQuery
                  ? `Search Results (${filteredItems.length})`
                  : activeTab === "projects"
                  ? "All Projects"
                  : "All Blueprints"}
              </h2>
              <div className="text-sm text-gray-600">
                {filteredItems.length} items found
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item, i) =>
                item.type === "project" ? (
                  <ProjectCard key={i} project={item} />
                ) : (
                  <BlueprintCard key={i} blueprint={item} />
                )
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Folder className="w-6 h-6 text-blue-600" />
                  <span>Recent Projects</span>
                </h2>
                <button
                  onClick={() => router.push("/dashboard/projects")}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            {/* Recent Blueprints */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <span>Recent Blueprints</span>
                </h2>
                <button
                  onClick={() => router.push("/dashboard/blueprint")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-4">
                {blueprints.slice(0, 5).map((blueprint) => (
                  <BlueprintCard key={blueprint.id} blueprint={blueprint} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
