"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
} from "lucide-react";
import { User } from "../../types";
import { getInitials } from "../../lib/utils";

export interface HeaderProps {
  title: string;
  currentUser: User;
}

export function Header({ title, currentUser }: HeaderProps): React.JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/logout";
    }
  };

  return (
    <header
      id="dashboard-header"
      className="sticky top-0 right-0 left-0 flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 z-10"
    >
      {/* Left section: Title */}
      <div id="header-left">
        <h2
          id="header-page-title"
          className="text-lg font-bold text-gray-900 tracking-tight"
        >
          {title}
        </h2>
      </div>

      {/* Right section: Notifications & User profile dropdown */}
      <div id="header-right" className="flex items-center gap-6">
        {/* Notification Bell with Badge */}
        <div
          id="header-notification-wrapper"
          ref={bellRef}
          className="relative"
        >
          <button
            id="header-notification-button"
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <Bell id="header-notification-icon" className="w-5 h-5" />
            <span
              id="header-notification-badge"
              className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"
            />
          </button>

          {showNotifications && (
            <div
              id="header-notification-dropdown"
              className="absolute right-0 mt-2.5 w-80 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-30"
            >
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">
                  Notifications
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                  1 New
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-800">
                    New Document Ready
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    &quot;Employee Handbook 2024.pdf&quot; has finished
                    processing and is ready for querying.
                  </p>
                  <span className="text-[9px] text-gray-400 mt-1 block">
                    2 minutes ago
                  </span>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="text-xs font-medium text-gray-700">
                    Welcome to DocuMind AI
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Your team workspace has been set up successfully. Start
                    uploading files!
                  </p>
                  <span className="text-[9px] text-gray-400 mt-1 block">
                    1 day ago
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" aria-hidden="true" />

        {/* User Dropdown */}
        <div id="header-user-wrapper" ref={dropdownRef} className="relative">
          <button
            id="header-user-trigger"
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors duration-150 focus:outline-none"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div
              id="header-avatar"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-sm"
            >
              {getInitials(currentUser.name)}
            </div>
            <span
              id="header-username"
              className="hidden md:block text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              {currentUser.name}
            </span>
            <ChevronDown className="hidden md:block w-4 h-4 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div
              id="header-user-dropdown"
              className="absolute right-0 mt-2.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-30"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="header-user-trigger"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-xs font-semibold text-gray-900 truncate mt-0.5">
                  {currentUser.email}
                </p>
              </div>

              <div className="py-1">
                <button
                  id="dropdown-option-profile"
                  type="button"
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span>My Profile</span>
                </button>

                <button
                  id="dropdown-option-settings"
                  type="button"
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>Workspace Settings</span>
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1 mt-1">
                <button
                  id="dropdown-option-logout"
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors text-left"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
