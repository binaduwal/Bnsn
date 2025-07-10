"use client";

import {
  ChevronDown,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between h-20  mx-auto px-6">
        {/* Logo */}
        <div className="w-40 h-auto relative">
          <Link href={"/user/userDash"} className="block">
            <Image
              src="/District_Logo.png"
              alt="District Logo"
              width={250}
              height={70}
              className="w-full h-auto"
            />
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative max-w-max  w-[280px]">
            <div className="bg-white backdrop-blur-sm  border border-gray-700/80  rounded-full flex items-center w-full gap-3 px-4 py-2   focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200">
              <Search className="w-5 h-5 min-w-max text-gray-400" />
              <input
                placeholder="Search tools, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-black placeholder-gray-400 flex-1"
              />
              {searchQuery && (
                <div className="  absolute top-1/2 right-1 -translate-y-1/2 ">
                  <button
                    onClick={() => setSearchQuery("")}
                    className="w-5 h-5  cursor-pointer flex items-center justify-center text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5 min-w-max text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="w-10 h-10 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-700/80 transition-colors border border-gray-700/50">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-full gap-3 hover:bg-gray-700/80 transition-all duration-200 border border-gray-700/50"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-full flex justify-center items-center shadow-md">
                <span className="font-semibold text-white text-sm">M</span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-white text-sm font-medium">
                  Mukesh Bhattarai
                </p>
                <p className="text-gray-400 text-xs">Administrator</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 py-2 z-50">
                {/* Profile Header */}
                <div className="px-4 py-3 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-full flex justify-center items-center shadow-md">
                      <span className="font-semibold text-white">M</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        Mukesh Bhattarai
                      </p>
                      <p className="text-gray-400 text-sm">
                        mukesh@district.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    role="button"
                    onClick={toggleProfile}
                    href={"/dashboard/profile"}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile Settings</span>
                  </Link>
                  <button
                    onClick={toggleProfile}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Preferences</span>
                  </button>
                  <button
                    onClick={toggleProfile}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">Notifications</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-700/50 pt-2">
                  <button
                    onClick={toggleProfile}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-600/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default Header;
