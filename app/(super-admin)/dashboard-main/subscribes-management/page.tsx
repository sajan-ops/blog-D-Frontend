"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import axios from "axios";
import { apiUrl } from "@/lib/apiConfig";

// Function to format dates
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [subscriptionsInput, setSubscriptionsInput] = useState<any>({
    id: "",
    packageName: "",
    price: "",
  });

  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Handle subscription click to view details
  const handleSubscriptionClick = (subscription: any) => {
    setSelectedSubscription(subscription);
  };

  // Close the subscription details modal
  const closeDetails = () => {
    setSelectedSubscription(null);
  };

  // Toggle subscription status
  const toggleSubscriptionStatus = (id: string, newStatus: string) => {
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: newStatus } : sub,
      ),
    );
  };

  // Fetch users
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
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
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch subscriptions
  const fetchAllSubs = async () => {
    const superAdminToken = localStorage.getItem("superAdminToken");
    if (!superAdminToken) {
      alert("You must be logged in as a Super Admin.");
      return;
    }

    try {
      const { data } = await axios.get(
        `${apiUrl}/admin-super/userHandler/getAllSubscribers`,
        {
          headers: {
            Authorization: `Bearer ${superAdminToken}`,
          },
        },
      );

      if (data.success) {
        setSubscriptions(data.subscribers);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  useEffect(() => {
    fetchAllSubs();
  }, []);

  // Fetch all subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const superAdminToken = localStorage.getItem("superAdminToken");
        if (!superAdminToken) {
          alert("You must be logged in as a Super Admin.");
          return;
        }

        const { data } = await axios.get(
          `${apiUrl}/admin-super/subscriptions/allplans`,
          {
            headers: {
              Authorization: `Bearer ${superAdminToken}`,
            },
          },
        );

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

  // Add a new subscriber
  const addSubscriber = async () => {
    console.log("Subscription Data:", subscriptionsInput);
    const superAdminToken = localStorage.getItem("superAdminToken");
    if (!superAdminToken) {
      alert("You must be logged in as a Super Admin.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${apiUrl}/admin-super/userHandler/addNewSubscriber`,
        subscriptionsInput,
        {
          headers: {
            Authorization: `Bearer ${superAdminToken}`,
          },
        },
      );

      if (data.success) {
        alert("User added successfully");
        setNewUser({ firstName: "", lastName: "", email: "", password: "" });
        fetchUsers();
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    }
  };

  // Handle package change
  const handlePackageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const packageName = e.target.value;
    const price = selectedOption.getAttribute("data-package-price");

    setSubscriptionsInput((prevState: any) => ({
      ...prevState,
      packageName,
      price: Number(price) || "",
    }));
  };

  // Handle email change
  const handleEmailChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSubscriptionsInput((prevState: any) => ({
      ...prevState,
      id,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 pt-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">
          Subscription Management
        </h1>
        {/* Add subscriber Form */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="mb-2 block">
                Email address
              </label>
              <select
                id="email"
                value={subscriptionsInput.id}
                onChange={handleEmailChange}
                className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a User</option>
                {users.map((option) => (
                  <option key={option.email} value={option.id}>
                    {option.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="package" className="mb-2 block">
                Select Package/ month
              </label>
              <select
                id="package"
                value={subscriptionsInput.packageName}
                onChange={handlePackageChange}
                className="w-full rounded-md border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a Plan</option>
                {plans.map((option) => (
                  <option
                    key={option.id}
                    value={option.name}
                    data-package-price={option.price}
                  >
                    {option.name} - ${option.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={addSubscriber}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
          >
            Add Subscriber
          </button>
        </div>
        {/* Subscription List */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Subscription List
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    Email
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    Plan
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    Price
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    Start Date
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    End Date
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr
                    key={subscription.id}
                    className="cursor-pointer bg-white transition duration-200 hover:bg-gray-100"
                    onClick={() => handleSubscriptionClick(subscription)}
                  >
                    <td className="border-b border-gray-300 px-4 py-2">
                      {subscription.firstName}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      {subscription.email}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      {subscription.plan}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      ${subscription.price.toFixed(2)}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      {formatDate(subscription.startDate)}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      {formatDate(subscription.endDate)}
                    </td>
                    <td className="flex space-x-2 border-b border-gray-300 px-4 py-2">
                      {subscription.status === "Active" ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubscriptionStatus(
                                subscription.id,
                                "Deactivated",
                              );
                            }}
                            className="rounded-md bg-yellow-500 px-3 py-1 text-white transition duration-300 hover:bg-yellow-600"
                          >
                            Deactivate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubscriptionStatus(
                                subscription.id,
                                "Canceled",
                              );
                            }}
                            className="rounded-md bg-red-500 px-3 py-1 text-white transition duration-300 hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubscriptionStatus(subscription.id, "Active");
                          }}
                          className="rounded-md bg-green-500 px-3 py-1 text-white transition duration-300 hover:bg-green-600"
                        >
                          Reactivate
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscriptionClick(subscription);
                        }}
                        className="rounded-md bg-blue-500 px-3 py-1 text-white transition duration-300 hover:bg-blue-600"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription Details Modal */}
        {selectedSubscription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg">
              <div className="flex justify-end">
                <button onClick={closeDetails}>
                  <XCircle className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <h2 className="mb-4 text-2xl font-bold">
                {selectedSubscription.customerName}
              </h2>
              <div className="mb-2">
                <span className="font-medium">Email:</span>{" "}
                {selectedSubscription.email}
              </div>
              <div className="mb-2">
                <span className="font-medium">Plan:</span>{" "}
                {selectedSubscription.plan}
              </div>
              <div className="mb-2">
                <span className="font-medium">Price:</span> $
                {selectedSubscription.price.toFixed(2)}
              </div>
              <div className="mb-2">
                <span className="font-medium">Start Date:</span>{" "}
                {formatDate(selectedSubscription.startDate)}
              </div>
              <div className="mb-2">
                <span className="font-medium">End Date:</span>{" "}
                {formatDate(selectedSubscription.endDate)}
              </div>
              <div className="mb-4">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`ml-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                    selectedSubscription.status === "Active"
                      ? "bg-green-200 text-green-700"
                      : selectedSubscription.status === "Deactivated"
                      ? "bg-yellow-200 text-yellow-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {selectedSubscription.status}
                </span>
              </div>
              <div className="flex justify-end space-x-2">
                {selectedSubscription.status === "Active" ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubscriptionStatus(
                          selectedSubscription.id,
                          "Deactivated",
                        );
                        closeDetails();
                      }}
                      className="rounded-md bg-yellow-500 px-4 py-2 text-white transition duration-300 hover:bg-yellow-600"
                    >
                      Deactivate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubscriptionStatus(
                          selectedSubscription.id,
                          "Canceled",
                        );
                        closeDetails();
                      }}
                      className="rounded-md bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSubscriptionStatus(
                        selectedSubscription.id,
                        "Active",
                      );
                      closeDetails();
                    }}
                    className="rounded-md bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagement;
