import React from "react";
import SectionHeader from "../Common/SectionHeader";
import { fetchRelatedPosts } from "./blogData";
import Link from "next/link";
import { getMediaUrlPath } from "@/lib/mediaUrl";

const Blog = async ({ category }) => {
  const postData = await fetchRelatedPosts(category);
  return (
    <section className="py-20 lg:py-25 xl:py-30">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        {/* <!-- Section Title Start --> */}
        <div className="mx-auto text-center">
          <SectionHeader
            headerInfo={{
              title: `Related Posts`,
              subtitle: `Latest Related Posts`,
              description: ``,
            }}
          />
        </div>
        {/* <!-- Section Title End --> */}
      </div>
      <div className="mx-auto mt-15 max-w-c-1280 px-4 md:px-8 xl:mt-20 xl:px-0">
        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {postData.map((post) => (
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
                <span className="text-sm text-gray-500">{new Date(post.date_created_in).toLocaleDateString()}</span>
              </Link>
            </div>
          ))
          }
        </div>
      </div>

    </section>
  );
};

export default Blog;
