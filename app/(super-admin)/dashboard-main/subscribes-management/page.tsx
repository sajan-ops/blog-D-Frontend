"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import axios from "axios";
import { apiUrl } from "@/lib/apiConfig";

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<any>([]);
  const plans = [
    { name: "Basic", price: 30 },
    { name: "Premium", price: 90 },
    { name: "Enterprice", price: 200 },
  ];
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
  const handleSubscriptionClick = (subscription) => {
    setSelectedSubscription(subscription);
  };

  const closeDetails = () => {
    setSelectedSubscription(null);
  };

  const toggleSubscriptionStatus = (id, newStatus) => {
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: newStatus } : sub,
      ),
    );
  };

  // fetchusers
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
  // fetch subs
  const fetchAllSubs = async () => {
    const superAdminToken = localStorage.getItem("superAdminToken");
    if (!superAdminToken) {
      alert("You must be logged in as a Super Admin.");
      return;
    }

    try {
      const { data } = await axios.get(
        `${apiUrl}/admin-super/userHandler/getAllSubscribers`, // Replace with your API endpoint

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
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    }
  };
  useEffect(() => {
    fetchAllSubs();
  }, []);

  const addSubscriber = async () => {
    console.log("Subscription Data:", subscriptionsInput);
    const superAdminToken = localStorage.getItem("superAdminToken");
    if (!superAdminToken) {
      alert("You must be logged in as a Super Admin.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${apiUrl}/admin-super/userHandler/addNewSubscriber`, // Replace with your API endpoint
        subscriptionsInput,
        {
          headers: {
            Authorization: `Bearer ${superAdminToken}`,
          },
        },
      );

      if (data.success) {
        alert("User added successfully");

        // Optionally reset the form
        setNewUser({ firstName: "", lastName: "", email: "", password: "" });
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user.");
    }
  };

  const handlePackageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const packageName = e.target.value;
    const price = selectedOption.getAttribute("data-package-price");

    setSubscriptionsInput((prevState) => ({
      ...prevState,
      packageName,
      price: Number(price) || "",
    }));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSubscriptionsInput((prevState) => ({
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
                    key={option.name}
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
                  {/* <th className="border-b border-gray-300 px-4 py-2 text-left font-medium text-gray-600">
                    Status
                  </th> */}
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
                      {subscription.startDate}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      {subscription.endDate}
                    </td>
                    {/* <td className="border-b border-gray-300 px-4 py-2">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-sm font-semibold ${
                          subscription.status === "Active"
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {subscription.status}
                      </span>
                    </td> */}
                    <td className="flex space-x-2 border-b border-gray-300 px-4 py-2">
                      {subscription.status === "Active" ? (
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
          <div className="fixed inset-0 z-50 flex items-center justify-center">
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
                {selectedSubscription.startDate}
              </div>
              <div className="mb-2">
                <span className="font-medium">End Date:</span>{" "}
                {selectedSubscription.endDate}
              </div>
              <div className="mb-4">
                <span className="font-medium">Status:</span>{" "}
                {selectedSubscription.status}
              </div>
              <div className="flex justify-end">
                {selectedSubscription.status === "Active" ? (
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
                    Cancel Subscription
                  </button>
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
