"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Home,
  FileText,
  PlusCircle,
  Settings,
  Users,
  Database,
  BarChart,
  Bell,
} from "lucide-react";

const Navbar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const navRef = useRef<any>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define menu items based on role
  const menuItems =
    role === "superAdmin"
      ? [
          { name: "Dashboard", href: "/dashboard", icon: Home },
          { name: "Admin Management", href: "/admins", icon: Users },
          { name: "Analytics", href: "/analytics", icon: BarChart },
          { name: "System Logs", href: "/logs", icon: Database },
          { name: "Settings", href: "/settings", icon: Settings },
        ]
      : [
          { name: "Dashboard", href: "/dashboard", icon: Home },
          { name: "Posts", href: "/posts", icon: FileText },
          { name: "Create Post", href: "/create-post", icon: PlusCircle },
          { name: "Settings", href: "/settings", icon: Settings },
        ];

  const roleColor =
    role === "superAdmin"
      ? "from-purple-600 to-indigo-600"
      : "from-blue-600 to-cyan-600";
  const hoverColor =
    role === "superAdmin" ? "hover:bg-purple-50" : "hover:bg-blue-50";

  return (
    <nav
      className="fixed z-10 w-full bg-white/90 shadow-sm backdrop-blur-md"
      ref={navRef}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className={`rounded-lg bg-gradient-to-r p-2 ${roleColor}`}>
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${roleColor} text-lg font-bold`}
            >
              {role === "superAdmin"
                ? "Executive Control Hub"
                : "Admin Dashboard"}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 text-gray-600 ${hoverColor} rounded-md px-3 py-2 text-sm font-medium transition duration-150 ease-in-out`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
              {/* Notification Bell */}
              <div className="relative">
                <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute right-0 top-0 flex h-5 w-5 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 ${hoverColor} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-${
                role === "superAdmin" ? "purple" : "blue"
              }-500`}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t bg-white/90 backdrop-blur-md md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 text-gray-600 ${hoverColor} block rounded-md px-3 py-2 text-base font-medium`}
                onClick={closeMenu}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
            {/* Mobile Notifications */}
            <div className="flex items-center justify-between px-3 py-2 text-gray-600">
              <span className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </span>
              {notifications > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  {notifications}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
