import React from "react";
import { Search, MoreHorizontal, Copy, Edit, Trash2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  type: "project" | "blueprint";
}

const Dashboard: React.FC = () => {
  const projects: Project[] = [
    { id: "1", name: "Test with ecom", type: "project" },
    { id: "2", name: "Test", type: "project" },
    { id: "3", name: "Ai Assisted Agency Acclerator", type: "project" },
    { id: "4", name: "Ai Assisted Agency Acclerator", type: "project" },
    { id: "5", name: "Ai Assisted® Agency Accelerator", type: "project" },
  ];

  const blueprints: Project[] = [
    {
      id: "1",
      name: "Viral Content Engine for Women's Activewear (Copy)",
      type: "blueprint",
    },
    {
      id: "2",
      name: "Viral Content Engine for Women's Activewear",
      type: "blueprint",
    },
    { id: "3", name: "AI Agency Accelerator", type: "blueprint" },
    { id: "4", name: "Your Best Life", type: "blueprint" },
    { id: "5", name: "Dr. Hoyos Medical Office", type: "blueprint" },
  ];

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-white/60 rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8  rounded flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
        </div>
        <span className="text-gray-900 font-medium">{project.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
          <MoreHorizontal size={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
          <Copy size={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
          <Edit size={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  const BlueprintCard: React.FC<{ blueprint: Project }> = ({ blueprint }) => (
    <div className="bg-white/60 rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
        </div>
        <span className="text-gray-900 font-medium">{blueprint.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
          <Copy size={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
          <Edit size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className=" max-h-max overflow-y-auto rounded-lg bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome, Kane!
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search your projects or blueprints by keyword..."
              className="w-full px-4 py-3 pr-12 bg-gray-300/40 rounded-lg border border-gray-300 outline-none "
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent projects
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                All projects
              </button>
            </div>
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          {/* Recent Blueprints */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent blueprints
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                All blueprints
              </button>
            </div>
            <div className="space-y-3">
              {blueprints.map((blueprint) => (
                <BlueprintCard key={blueprint.id} blueprint={blueprint} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
