"use client";

import { useAuthStore } from "@/store/authStore";
import {
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  User,
  X,
  BarChart3,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getWordCountApi } from "@/services/authApi";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [stats, setStats] = useState({ wordsLeft: 100000, totalWords: 100000 });
  const {user} = useAuthStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const fetchWordCount = async () => {
    try {
      const response = await getWordCountApi();
      setStats({
        wordsLeft: response.data.wordsLeft,
        totalWords: response.data.totalWords,
      });
    } catch (error) {
      console.error("Error fetching word count:", error);
    }
  };

  useEffect(() => {
    fetchWordCount();
    // Refresh word count every 30 seconds
    const interval = setInterval(fetchWordCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const logoutFn = () => {
    logout();
    router.push("/login");
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between h-20  mx-auto px-6">
        {/* Logo */}
        <div className="w-40 h-auto relative">
          <Link href={"/dashboard"} className="block">
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
          {/* Word Count Section */}
          <div className="flex items-center space-x-3">
            <Link 
              href="/dashboard/purchase"
              className="flex items-center space-x-3 px-3 py-2 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-sm hover:bg-gray-700/80 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-sm font-medium text-gray-300 group-hover:text-gray-200 transition-colors">Words:</span>
              </div>
              <span className="font-bold text-base bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-200">
                {stats.wordsLeft.toLocaleString()}
              </span>
            </Link>

            <div className="w-24 bg-gray-700 rounded-full h-2 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${((stats.totalWords - stats.wordsLeft) / stats.totalWords) * 100}%` }}
              />
            </div>
          </div>
          {/* Search Bar */}
         

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
                <span className="font-semibold text-white text-sm">{user?.firstName.charAt(0)}</span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-white text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-400 text-xs">{user?.role}</p>
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
                      <span className="font-semibold text-white">{user?.firstName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {user?.email}
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
                  {user?.role === 'admin' && (
                    <Link
                      role="button"
                      onClick={toggleProfile}
                      href="/admin"
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Admin Panel</span>
                    </Link>
                  )}
                </div>

                {/* Logout */}
                <div className="border-t border-gray-700/50 pt-2">
                  <button
                    onClick={logoutFn}
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
          className="fixed h-screen w-screen inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default Header;
