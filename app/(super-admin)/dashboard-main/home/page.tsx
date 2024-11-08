"use client";

import Link from "next/link";

const DashboardOverview = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Super Admin Dashboard
        </h1>

        {/* Metrics */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Total Users */}
          <div className="rounded-lg bg-indigo-50 p-4 shadow-md">
            <h2 className="text-xl font-semibold text-indigo-700">
              Total Users
            </h2>
            <p className="mt-2 text-3xl font-bold text-indigo-900">123,456</p>
            <p className="text-sm text-indigo-600">
              Active: 100,000 | Inactive: 23,456
            </p>
          </div>

          {/* Subscription Overview */}
          <div className="rounded-lg bg-green-50 p-4 shadow-md">
            <h2 className="text-xl font-semibold text-green-700">
              Subscription Overview
            </h2>
            <p className="mt-2 text-3xl font-bold text-green-900">90,000</p>
            <p className="text-sm text-green-600">Active | Expired: 10,000</p>
          </div>

          {/* Revenue Summary */}
          <div className="rounded-lg bg-yellow-50 p-4 shadow-md">
            <h2 className="text-xl font-semibold text-yellow-700">
              Revenue Summary
            </h2>
            <p className="mt-2 text-3xl font-bold text-yellow-900">$500,000</p>
            <p className="text-sm text-yellow-600">Monthly | Churn Rate: 5%</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-4">
          <Link
            href={"/dashboard-main/user-management"}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-center font-semibold text-white hover:bg-indigo-500"
          >
            User Management
          </Link>
          <Link
            href={"/dashboard-main/subscribes-management"}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-center font-semibold text-white hover:bg-green-500"
          >
            Subscription Management
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
