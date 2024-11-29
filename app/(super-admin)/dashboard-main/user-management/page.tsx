"use client";
import { apiUrl } from "@/lib/apiConfig";
import axios from "axios";
import React, { useEffect, useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState<any>([]);

  const fetechUsers = async () => {
    try {
      const adminToken = localStorage.getItem("superAdminToken");
      const { data } = await axios.get(
        `${apiUrl}/admin-super/userHandler/getUsers`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    fetechUsers();
  }, []);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const addUser = async () => {
    const superAdminToken = localStorage.getItem("superAdminToken");

    if (!superAdminToken) {
      alert("You must be logged in as a Super Admin.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${apiUrl}/admin-super/userHandler/addNewUser`, // Replace with your API endpoint
        newUser,
        {
          headers: {
            Authorization: `Bearer ${superAdminToken}`,
          },
        },
      );

      if (data.success) {
        alert("User added successfully");
        fetechUsers();
        // Optionally reset the form
        setNewUser({ firstName: "", lastName: "", email: "", password: "" });
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    }
  };

  const deleteUser = async (id: string) => {
    const superAdminToken = localStorage.getItem("superAdminToken");

    try {
      const { data } = await axios.delete(
        `${apiUrl}/admin-super/userHandler/deleteAuser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${superAdminToken}`, // Include the token here
          },
        },
      );
      console.log("User deleted:", data);
      if (data.success) {
        fetechUsers();
      }
      // Handle any additional logic, like updating the UI or state
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 pt-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">
          User Management
        </h1>

        {/* Add User Form */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Add New User
          </h2>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newUser.firstName}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={addUser}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
          >
            Add User
          </button>
        </div>

        {/* User List */}
        <div className="rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            User List
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                    ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                    Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                    Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white transition-colors duration-200 hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {user.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {user.firstName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      <span
                        className={`rounded-full px-2 py-1 text-white ${
                          user.verified === 1 ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {user.verified === 1 ? "Verified" : "Not Verified"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="rounded-md bg-red-500 px-3 py-1 text-white transition duration-300 hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
