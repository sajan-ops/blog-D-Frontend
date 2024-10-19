"use client"
import { apiUrl } from '@/lib/apiConfig';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
    const [Email, setEmail] = useState<string | null>(null);
    // reset password function
    const resetPassword = async (e: any) => {
        e.preventDefault();
        toast.loading("Processing");
        try {
            let { data } = await axios.post(`${apiUrl}/user/forgotpassword/${Email}`)
            if (data.success) {
                toast.dismiss()
                toast.success("Email sent successfully.Please check your inbox")

            }
        } catch (error) {
            console.log("error", error)
            toast.dismiss()
            toast.error("Internal server error")
        }

    }
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} containerStyle={{ zIndex: 999990 }} />
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        No worries, just enter your email and we'll send you a reset link.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={resetPassword}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Send Reset Link
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/auth/signin" className="text-blue-500 hover:text-blue-500 text-sm">
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div></>
    );
};

export default ForgotPassword;
