"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { apiUrl } from "@/lib/apiConfig";

const GoogleCrawlStatistics = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("1m"); // Default to 1 month

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken"); // Get token from local storage
      const response = await axios.post(
        `${apiUrl}/admin/post/googleStats/?filter=${dateFilter}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        },
      );

      console.log(response.data); // Log the entire response for debugging
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err); // Log the error
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateFilter]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Prepare data for the chart
  const chartData = data.map((item) => ({
    date: item.date,
    clicks: item.clicks,
    impressions: item.impressions,
  }));

  return (
    <div className="mx-auto mb-20 max-w-6xl rounded-lg bg-white p-6 pt-20 shadow-md">
      <h2 className="my-2 mb-4 text-center text-2xl font-bold">
        Google Search Console Stats
      </h2>
      {/* Date Filter Buttons */}
      <div className="mb-4 flex justify-center space-x-4">
        {["1w", "1m", "2m", "3m"].map((range) => (
          <button
            key={range}
            className={`rounded px-4 py-2 ${
              dateFilter === range ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setDateFilter(range)}
          >
            {range === "today"
              ? "Today"
              : range.replace("m", " Month").replace("w", " Week")}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="clicks" fill="rgba(75, 192, 192, 0.6)" name="Clicks" />
          <Bar
            dataKey="impressions"
            fill="rgba(255, 99, 132, 0.6)"
            name="Impressions"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-gray-50 p-4">
          <h3 className="font-semibold">Total Clicks</h3>
          <p className="text-lg">
            {chartData.reduce((acc, curr) => acc + curr.clicks, 0)}
          </p>
        </div>
        <div className="rounded-lg border bg-gray-50 p-4">
          <h3 className="font-semibold">Total Impressions</h3>
          <p className="text-lg">
            {chartData.reduce((acc, curr) => acc + curr.impressions, 0)}
          </p>
        </div>
        <div className="rounded-lg border bg-gray-50 p-4">
          <h3 className="font-semibold">Average CTR</h3>
          <p className="text-lg">
            {(
              (chartData.reduce((acc, curr) => acc + curr.clicks, 0) /
                chartData.reduce((acc, curr) => acc + curr.impressions, 0)) *
              100
            ).toFixed(2)}
            %
          </p>
        </div>
      </div>

      {/* Table for detailed statistics */}
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-bold">Detailed Statistics</h3>
        <table className="min-w-full border border-gray-300 bg-white text-left">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Date</th>
              <th className="border-b px-4 py-2">Indexed Page</th>
              <th className="border-b px-4 py-2">Keywords</th>
              <th className="border-b px-4 py-2">Country</th>
              <th className="border-b px-4 py-2">Device</th>
              <th className="border-b px-4 py-2">Clicks</th>
              <th className="border-b px-4 py-2">Impressions</th>
              <th className="border-b px-4 py-2">CTR</th>
              <th className="border-b px-4 py-2">Average Position</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border-b px-4 py-2">{item.date}</td>
                <td className="border-b px-4 py-2">{item.page}</td>
                <td className="border-b px-4 py-2">{item.query}</td>
                <td className="border-b px-4 py-2">{item.country}</td>
                <td className="border-b px-4 py-2">{item.device}</td>
                <td className="border-b px-4 py-2">{item.clicks}</td>
                <td className="border-b px-4 py-2">{item.impressions}</td>
                <td className="border-b px-4 py-2">{item.ctr}</td>
                <td className="border-b px-4 py-2">{item.averagePosition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoogleCrawlStatistics;
