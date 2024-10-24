"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you're using axios for API requests
import { apiUrl } from "@/lib/apiConfig";

const Categories = () => {
    const [categories, setCategories] = useState<any>([]);
    const [newCategory, setNewCategory] = useState<any>("");

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        let token = localStorage.getItem("adminToken");
        try {
            const { data } = await axios.get(`${apiUrl}/admin/post/fetchAllCategories`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                },
            });
            setCategories(data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };


    const handleAddCategory = async (e: any) => {
        e.preventDefault()
        try {
            if (newCategory.trim()) {
                let token = localStorage.getItem("adminToken");
                const response = await axios.post(
                    `${apiUrl}/admin/post/addCategory`,
                    { name: newCategory }, // Data to send in the request body
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                        },
                    }
                );
                setCategories([...categories, response.data]);
                fetchCategories()

            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        let token = localStorage.getItem("adminToken");
        try {
            await axios.delete(`${apiUrl}/admin/post/deleteSingleCateogry/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                },
            });
            fetchCategories()
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };


    return (
        <div className="container mx-auto p-4 pt-20">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>

            {/* Form to add a new category */}
            <form className="flex items-center mb-4" onSubmit={handleAddCategory}>
                <input
                    type="text"
                    className="border rounded px-3 py-2 mr-2 w-full max-w-sm"
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                />
                <button

                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Add
                </button>
            </form>

            {/* Existing categories */}
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories && categories.map((category) => (
                    <li
                        key={category.id}
                        className="border p-4 flex justify-between items-center rounded shadow"
                    >
                        <span>{category.name}</span>
                        <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-500 hover:text-red-700 transition"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
