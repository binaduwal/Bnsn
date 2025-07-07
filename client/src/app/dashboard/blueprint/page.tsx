'use client'
import React, { useState } from 'react';
import { Search, Plus, Copy, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, HelpCircle } from 'lucide-react';

interface Blueprint {
  id: string;
  name: string;
}

const BlueprintPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const blueprints: Blueprint[] = [
    { id: '1', name: 'Viral Content Engine for Women\'s Activewear' },
    { id: '2', name: 'AI Agency Accelerator' },
    { id: '3', name: 'Your Best Life' },
    { id: '4', name: 'Dr. Hoyos Medical Office' },
    { id: '5', name: 'test blueprint 2' },
    { id: '6', name: 'Outreach for business owners to sell their company' },
    { id: '7', name: 'Aatus test blueprint' },
    { id: '8', name: 'AI Assisted Course Creation Launch' },
    { id: '9', name: 'Industry Rockstar AI Summit' },
  ];

  const totalPages = Math.ceil(blueprints.length / itemsPerPage);

  const BlueprintRow: React.FC<{ blueprint: Blueprint }> = ({ blueprint }) => (
      <div className="flex items-center justify-between py-4 px-6 group border-b border-gray-200 hover:bg-gray-50 group">
          <div className="flex items-center space-x-4">
         
            <span className="text-gray-900  font-semibold group-hover:text-blue-700 ">{blueprint.name}</span>
          </div>
          <div className="flex items-center space-x-2  transition-opacity">
            <button className="w-8 h-8 flex items-center justify-center text-blue-300 hover:text-gray-600 hover:bg-gray-100 rounded">
              <Copy size={16} />
            </button>
        
            <button className="w-8 h-8 flex items-center justify-center text-blue-300 hover:text-red-600 hover:bg-gray-100 rounded">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
  );

  return (
      <div className='bg-white p-2 rounded-lg'>

      <div className=" max-w-7xl mx-auto  ">
        {/* Header */}
        <div className="bg-white  shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Blueprints</h1>
          </div>
          
         {/* Search and Add Button */}
                <div className="px-6 py-4  flex items-center gap-2 justify-between">
                  <div className="flex items-center flex-1 space-x-4">
                    <div className="relative overflow-hidden rounded-xl border border-gray-400 w-full">
                      <input
                        type="text"
                        placeholder="Search Blueprints..."
                        className="w-full px-4 py-3 pr-10  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="absolute right-0 top-1/2 transform -translate-y-1/2 border border-gray-600 w-14 h-full bg-gray-600 text-white  flex items-center justify-center hover:bg-gray-700 transition-colors">
                        <Search size={20} />
                      </button>
                    </div>
                  </div>
      
      
      
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-[48px] rounded-lg flex items-center space-x-2 transition-colors">
                    <Plus size={24}  />
                  </button>
                </div>
        </div>

        {/* Table */}
        <div className="bg-white max-h-[640px] overflow-y-auto rounded-lg shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                <span>Name</span>
                {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {blueprints.map((blueprint) => (
              <BlueprintRow key={blueprint.id} blueprint={blueprint} />
            ))}
          </div>
             {/* Pagination */}
      <div className="flex items-center justify-center space-x-4 py-8">
      {/* First Page Button */}
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsLeft size={16} />
      </button>

      {/* Previous Page Button */}
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Input */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Page</span>
        <input
          type="number"
          value={currentPage}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
          className="w-12 px-2 py-1 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          min="1"
          max={totalPages}
        />
        <span className="text-sm text-gray-600">of {totalPages}</span>
      </div>

      {/* Next Page Button */}
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsRight size={16} />
      </button>

      {/* Items per page dropdown */}
      <div className="flex items-center space-x-2 ml-8">
        <span className="text-sm text-gray-600">Items per page:</span>
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

     
      </div>
      </div>

  
  );
};

export default BlueprintPage;