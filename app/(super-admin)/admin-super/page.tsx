"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Lock, Mail, Shield, Loader2 } from "lucide-react";
import { apiUrl } from "../../../lib/apiConfig";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`${apiUrl}/admin-super/signin`, {
        email,
        password,
        role: "superAdmin",
      });

      if (data.message === "confirmEmail") {
        setError("Verify it's you! Please check your email.");
      } else if (data.message === "successLogin") {
        localStorage.setItem("superAdminToken", data.token);
        router.push("/dashboard-main/home");
      } else if (data.message === "Wrong Credentials!") {
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-2xl bg-white/90 p-8 shadow-[0_0_40px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,0,0,0.2)]">
          {/* Logo/Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-indigo-600 p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              Administrative Center
            </h1>
            <p className="mt-2 text-gray-600">
              Secure access to administrative controls
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white/50 py-2.5 pl-10 pr-4 backdrop-blur-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    id="password"
                    type="password"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white/50 py-2.5 pl-10 pr-4 backdrop-blur-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 font-medium text-white transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in to Dashboard</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-white/80">
          Protected by enterprise-grade security
        </div>
      </div>
    </div>
  );
}
