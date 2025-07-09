"use client";

import {
  LucideWand2,
  LucideChevronDown,
  LucideChevronRight,
  LucideLayoutDashboard,
  LucideFileText,
  LucideFolder,
  LucidePuzzle,
  LucideBook,
  LucideListOrdered,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

function Sidebar() {
  const [activeLink, setActiveLink] = useState("/dashboard");
  const [expandedItems, setExpandedItems] = useState<string[]>(["Add On"]);

  const navLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LucideLayoutDashboard size={20} />,
    },
    {
      label: "Blueprint",
      href: "/dashboard/blueprint",
      icon: <LucideFileText size={20} />,
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: <LucideFolder size={20} />,
    },
    {
      label: "Orders",
      href: "/dashboard/orders",
      icon: <LucideListOrdered size={20} />,
    },
  ];

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
  };

  const isActive = (href: string) => activeLink === href;
  const isExpanded = (label: string) => expandedItems.includes(label);

  return (
    <div className="w-[300px] h-full bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <LucideLayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
              Workspace
            </h2>
            <p className="text-sm text-gray-500">Kane's Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="flex flex-col gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => handleLinkClick(item.href)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-medium mb-1 ${
                isActive(item.href)
                  ? "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 shadow-sm border border-purple-200/50"
                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <span
                className={`${
                  isActive(item.href) ? "text-purple-600" : "text-purple-500"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive(item.href) && (
                <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full"></div>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 mt-auto border-t border-gray-200/50">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <LucideWand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Pro Tips</h3>
              <p className="text-xs text-gray-600">Shortcuts & features</p>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm py-2 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
