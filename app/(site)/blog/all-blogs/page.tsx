// app/dashboard/posts/page.tsx
import PostActions from "@/components/Blog/PostFilters";
import { apiUrl } from "@/lib/apiConfig";
import { getMediaUrlPath } from "@/lib/mediaUrl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Post {
  id: number;
  slug: string;
  title: string;
  description: string;
  filePath: string;
  date_created_in: string;
}

interface response {
  rows: any;
  pageNumber: any;
}

async function getPosts(page: any): Promise<response | []> {
  try {
    const res = await fetch(
      `${apiUrl}/user/post/getAllposts/instant?filterType=all&filter=null&page=${Number(
        page,
      )}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch posts");

    const data = await res.json();
    let rows = data.rows;
    let pagenumber = data.pageNumber;
    if (data.success) {
      return {
        rows,
        pageNumber: pagenumber,
      };
    }
    return [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function Posts({ searchParams }) {
  let { page } = searchParams;
  const posts: any = await getPosts(page);
  return (
    <div className="mx-auto max-w-4xl p-6 pt-32">
      <h1 className="mb-6 text-center text-3xl font-bold">Blog Posts</h1>
      <PostActions />
      {!posts.rows?.length ? (
        <div className="m-auto mt-30 flex items-center justify-center space-x-3 text-center">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            {/* SVG paths... */}
          </svg>
          <span>No Posts yet.</span>
        </div>
      ) : (
        <>
          <h2 className="mb-7 mt-2 text-center underline underline-offset-4">
            All Posts
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.rows.map((post: Post) => (
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
        </>
      )}
      <div className="mx-auto my-14 flex max-w-xl items-center justify-center gap-4">
        <Link
          className={`flex items-center gap-1 rounded-lg px-4 py-2 transition-colors duration-200 
          ${
            posts?.pageNumber === 1
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
          href={`?page=${
            isNaN(posts?.pageNumber) ? "" : posts?.pageNumber - 2
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Link>
        <Link
          className={`flex items-center gap-1 rounded-lg px-4 py-2 transition-colors duration-200
          ${
            posts?.rows?.length === 0
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
          href={`?page=${
            isNaN(posts?.pageNumber) || posts?.rows?.length === 0
              ? 1
              : posts.pageNumber
          }`}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
