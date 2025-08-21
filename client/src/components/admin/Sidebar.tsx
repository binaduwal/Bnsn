'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  FolderOpen, 
  FileText, 
  BarChart3,
  Activity,
  FolderTree,
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'Blueprints', href: '/admin/blueprints', icon: FileText },
  { name: 'Activities', href: '/admin/activities', icon: Activity },
];



export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500 mt-0.5">Management Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-[1.01]'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200
                    ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
                  `}
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto h-2 w-2 bg-white rounded-full opacity-80"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="space-y-1">
          
          <Link href="/dashboard" className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out text-red-600 hover:bg-red-50 hover:text-red-700">
            <ChevronLeft className="mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 text-red-400 group-hover:text-red-600" />
            Back To Site
          </Link>
        </div>
      </div>
    </div>
  );
} 