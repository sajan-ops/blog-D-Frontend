"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Layers, Users, MessageSquare } from 'lucide-react';

const data = [
    { name: 'Jan', users: 400, posts: 240, comments: 240 },
    { name: 'Feb', users: 300, posts: 139, comments: 221 },
    { name: 'Mar', users: 200, posts: 980, comments: 229 },
    { name: 'Apr', users: 278, posts: 390, comments: 200 },
    { name: 'May', users: 189, posts: 480, comments: 218 },
    { name: 'Jun', users: 239, posts: 380, comments: 250 },
];

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    </div>
);

export default function AdminHome() {
    return (
        <div className="min-h-screen bg-gray-100 p-6 pt-20">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value="1,245" icon={Users} color="bg-blue-500" />
                <StatCard title="New Posts" value="52" icon={Layers} color="bg-green-500" />
                <StatCard title="Comments" value="187" icon={MessageSquare} color="bg-purple-500" />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Monthly Statistics</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" fill="#3b82f6" />
                        <Bar dataKey="posts" fill="#10b981" />
                        <Bar dataKey="comments" fill="#8b5cf6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}