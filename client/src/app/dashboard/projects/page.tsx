'use client'
import React, { useState } from 'react';
import { Search, Plus, Copy, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, MoreHorizontal, Filter, FolderOpen } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  blueprint?: string;
  created: string;
  modified: string;
  status: 'Active' | 'Draft' | 'Archived';
}

const ProjectsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlueprint, setSelectedBlueprint] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const blueprints = [
    'All Blueprints',
    'Viral Content Engine for Women\'s Activewear',
    'AI Agency Accelerator',
    'Your Best Life',
    'Dr. Hoyos Medical Office',
    'Outreach for business owners to sell their company',
  ];

  const projects: Project[] = [
    { id: '1', name: 'Viral Content Engine for Women\'s Activewear', blueprint: 'Viral Content Engine for Women\'s Activewear', created: '2024-01-15', modified: '2024-07-08', status: 'Active' },
    { id: '2', name: 'AI Agency Accelerator', blueprint: 'AI Agency Accelerator', created: '2024-02-20', modified: '2024-07-07', status: 'Active' },
    { id: '3', name: 'Your Best Life', blueprint: 'Your Best Life', created: '2024-03-10', modified: '2024-07-05', status: 'Draft' },
    { id: '4', name: 'Dr. Hoyos Medical Office', blueprint: 'Dr. Hoyos Medical Office', created: '2024-04-05', modified: '2024-07-03', status: 'Active' },
    { id: '5', name: 'Test Project 2', blueprint: 'AI Agency Accelerator', created: '2024-05-12', modified: '2024-07-02', status: 'Draft' },
    { id: '6', name: 'Outreach for Business Owners to Sell Their Company', blueprint: 'Outreach for business owners to sell their company', created: '2024-06-01', modified: '2024-07-01', status: 'Active' },
    { id: '7', name: 'Aatus Test Project', blueprint: 'AI Agency Accelerator', created: '2024-06-15', modified: '2024-06-30', status: 'Archived' },
    { id: '8', name: 'AI Assisted Course Creation Launch', blueprint: 'AI Agency Accelerator', created: '2024-06-20', modified: '2024-06-28', status: 'Active' },
    { id: '9', name: 'Industry Rockstar AI Summit', blueprint: 'Your Best Life', created: '2024-06-25', modified: '2024-06-25', status: 'Draft' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const ProjectRow: React.FC<{ project: Project }> = ({ project }) => (
    <tr className="hover:bg-gray-50 border-b border-gray-100">
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{project.name}</div>
        {project.blueprint && (
          <div className="text-sm text-gray-500 mt-1">Blueprint: {project.blueprint}</div>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{project.created}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{project.modified}</td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
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
      </td>
    </tr>
  );

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlueprint = selectedBlueprint === '' || selectedBlueprint === 'All Blueprints' || project.blueprint === selectedBlueprint;
    return matchesSearch && matchesBlueprint;
  });

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handleBlueprintSelect = (blueprint: string) => {
    setSelectedBlueprint(blueprint === 'All Blueprints' ? '' : blueprint);
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
              <p className="text-gray-600 mt-1">Manage and organize your project instances</p>
            </div>
            <Link role='button' href={'/dashboard/projects/new'} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors font-medium">
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            {/* Blueprint Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px] justify-between"
              >
                <div className="flex items-center space-x-2">
                  <FolderOpen size={16} />
                  <span className="text-sm">{selectedBlueprint || 'All Blueprints'}</span>
                </div>
                {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
            <span>{filteredProjects.filter(p => p.status === 'Active').length} active</span>
            <span>{filteredProjects.filter(p => p.status === 'Draft').length} drafts</span>
            <span>{filteredProjects.filter(p => p.status === 'Archived').length} archived</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Name</span>
                    {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                <ProjectRow key={project.id} project={project} />
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No projects found</div>
              <div className="text-gray-400 text-sm">Try adjusting your search or filter criteria</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProjects.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} results
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
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
    </div>
  );
};

export default ProjectsPage;