"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { XCircle } from "lucide-react"; 
import { apiUrl } from "@/lib/apiConfig";

const SubscriptionServicesPage = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [newPlan, setNewPlan] = useState({ name: "", price: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Fetch all subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const superAdminToken = localStorage.getItem("superAdminToken");
        if (!superAdminToken) {
          alert("You must be logged in as a Super Admin.");
          return;
        }

        const { data } = await axios.get(`${apiUrl}/admin-super/subscriptions/allplans`, {
          headers: {
            Authorization: `Bearer ${superAdminToken}`,
          },
        });

        if (data.success) {
          setPlans(data.plans);
        } else {
          setPlans([]);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        alert("An error occurred while fetching plans.");
      }
    };

    fetchPlans();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const superAdminToken = localStorage.getItem("superAdminToken");
      const { data } = await axios.get(`${apiUrl}/admin-super/userHandler/getUsers`, {
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
        },
      });
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create new subscription plan
  const handleAddPlan = async () => {
    if (!newPlan.name || !newPlan.price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const superAdminToken = localStorage.getItem("superAdminToken");
      if (!superAdminToken) {
        alert("You must be logged in as a Super Admin.");
        return;
      }

      const { data } = await axios.post(`${apiUrl}/admin-super/subscriptions/create-plan`, newPlan, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${superAdminToken}`,
        },
      });

      if (data.success) {
        setPlans([...plans, data.plan]);
        setNewPlan({ name: "", price: "" });
      }
    } catch (error) {
      console.error("Error adding plan:", error);
      alert("An error occurred while adding the plan.");
    }
  };

  // Update subscription plan
  const handleUpdatePlan = async (updatedPlan) => {
    try {
      const superAdminToken = localStorage.getItem("superAdminToken");
      if (!superAdminToken) {
        alert("You must be logged in as a Super Admin.");
        return;
      }

      const { data } = await axios.put(`${apiUrl}/admin-super/subscriptions/updateplan/${updatedPlan.id}`, updatedPlan, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${superAdminToken}`,
        },
      });

      if (data.success) {
        setPlans(plans.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan));
        setIsEditModalOpen(false);
        setEditingPlan(null);
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      alert("An error occurred while updating the plan.");
    }
  };

  // Delete subscription plan
  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      const superAdminToken = localStorage.getItem("superAdminToken");
      if (!superAdminToken) {
        alert("You must be logged in as a Super Admin.");
        return;
      }

      const { data } = await axios.delete(`${apiUrl}/admin-super/subscriptions/deleteplan/${id}`, {
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
        },
      });

      if (data.success) {
        setPlans(plans.filter(plan => plan.id !== id));
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("An error occurred while deleting the plan.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 pt-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">
          Packages Management
        </h1>

        {/* Add Plan Form */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Add New Plan</h2>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block">Plan Name</label>
              <input
                type="text"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Enter plan name"
              />
            </div>
            <div>
              <label className="mb-2 block">Price ($/month)</label>
              <input
                type="number"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Enter price"
              />
            </div>
          </div>
          <button
            onClick={handleAddPlan}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
          >
            Add Plan
          </button>
        </div>

        {/* Plans List Table */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Available Plans
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    Plan Name
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    Price ($/month)
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.length > 0 ? (
                  plans.map((plan) => (
                    <tr
                      key={plan.id}
                      className="cursor-pointer bg-white transition duration-200 hover:bg-gray-100"
                    >
                      <td className="border-b border-gray-300 px-4 py-2">
                        {plan.name}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        ${plan.price}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <button
                          onClick={() => {
                            setEditingPlan(plan);
                            setIsEditModalOpen(true);
                          }}
                          className="rounded-md bg-yellow-500 px-3 py-1 text-white transition duration-300 hover:bg-yellow-600 mr-2"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="rounded-md bg-red-500 px-3 py-1 text-white transition duration-300 hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="border-b border-gray-300 px-4 py-2 text-center text-gray-600">
                      No plans available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Update Plan</h2>
                <button onClick={() => setIsEditModalOpen(false)}>
                  <XCircle className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block">Plan Name</label>
                  <input
                    type="text"
                    value={editingPlan?.name}
                    onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                    className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block">Price ($/month)</label>
                  <input
                    type="number"
                    value={editingPlan?.price}
                    onChange={(e) => setEditingPlan({...editingPlan, price: e.target.value})}
                    className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-md bg-gray-500 px-4 py-2 text-white transition duration-300 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdatePlan(editingPlan)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionServicesPage;