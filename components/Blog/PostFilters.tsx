"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "@/lib/apiConfig";
import { getMediaUrlPath } from "@/lib/mediaUrl";
import Link from "next/link";

interface Category {
  name: string;
  id: number;
}

interface Author {
  name: string;
  id: number;
}

type FilterState = {
  category: string;
  status: string;
  author: string;
  date: string;
};

export default function PostActions() {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    status: "",
    author: "",
    date: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [filterBlogs, setfilterBlogs] = useState<any>();

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/user/post/getCatsAuthorsAndDates`,
      );
      if (data.success) {
        setCategories(data.categories);
        setAuthors(data.authors);
        setDates(data.dates);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = async (
    value: string,
    filterType: keyof FilterState,
  ) => {
    try {
      setFilters((prev) => ({ ...prev, [filterType]: value }));
      let { data } = await axios.get(
        `${apiUrl}/user/post/getAllposts/instant?filterType=${filterType}&filter=${value}`,
      );
      setfilterBlogs(data.rows);
    } catch (error) {
      console.error("Error applying filter:", error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Handle filter changes
  const searchOnchange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    let searchQuery = e.target.value;
    if (searchQuery === "") {
      setfilterBlogs(null);
      return;
    }
    try {
      let { data } = await axios.get(
        `${apiUrl}/user/post/getAllposts/instant?searchTerm=${searchQuery}`,
      );
      setfilterBlogs(data.rows);
    } catch (error) {
      console.error("Error applying filter:", error);
    }
  };

  return (
    <div>
      {/* Filters Section */}
      <div className="filters mb-6 space-x-3">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative mb-8 w-full">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
            <svg
              className="h-4 w-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
              />
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            className="block w-full rounded-lg border border-gray-300 p-2.5 ps-10 text-sm   focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Search by article name..."
            onChange={searchOnchange}
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => handleFilterChange(e.target.value, "category")}
          className="rounded border p-2"
        >
          <option value="category">Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange(e.target.value, "status")}
          className="rounded border p-2"
        >
          <option value="status">Status</option>
          <option value="instant">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={filters.author}
          onChange={(e) => handleFilterChange(e.target.value, "author")}
          className="rounded border p-2"
        >
          <option value="author">Authors</option>
          {authors.map((author) => (
            <option key={author.id} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange(e.target.value, "date")}
          className="rounded border p-2"
        />
      </div>
      {filterBlogs?.length > 0 && (
        <h2 className="mb-4 text-center underline underline-offset-4">
          Filtered Posts
        </h2>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filterBlogs &&
          filterBlogs.map((post: any) => (
            <div
              key={post.id}
              className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-shadow duration-200 hover:shadow-lg"
            >
              <Link href={`/blog/${post.slug}`}>
                <img
                  src={getMediaUrlPath(JSON.parse(post.filePath)[0])}
                  alt={post.title}
                  className="mb-4 h-40 w-full rounded-md object-cover"
                />
                <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                <p className="mb-4 text-gray-700">{post.description}</p>
                <span className="text-sm text-gray-500">
                  {new Date(post.date_created_in).toLocaleDateString()}
                </span>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
