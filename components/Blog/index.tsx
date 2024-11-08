import SectionHeader from "../Common/SectionHeader";
import { fetchUsersPosts } from "./blogData";
import Link from "next/link";
import { getMediaUrlPath } from "@/lib/mediaUrl";

const Blog = async () => {
  const postData = await fetchUsersPosts("null", "no filter");
  return (
    <><section className="py-20 lg:py-25 xl:py-30">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        {/* Section Title Start */}
        <div className="mx-auto text-center">
          <SectionHeader
            headerInfo={{
              title: `NEWS & BLOGS`,
              subtitle: ``,
              description: ``,
            }} />
        </div>
        {/* Section Title End */}
      </div>
      <div className="flex justify-center items-center h-full my-2">
        <Link href="/blog/all-blogs" className="inline-block text-2xl font-bold text-center mt-auto hover:underline">
          All Blogs
        </Link>
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
                  className="mb-4 h-40 w-full rounded-md object-cover" />
                <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                <p className="mb-4 text-gray-700">{post.description}</p>
                <span className="text-sm text-gray-500">{new Date(post.date_created_in).toLocaleDateString()}</span>
              </Link>
              <div className="text-right mt-2">
                <Link href={`/blog/${post.slug}`}>
                  <span className="text-blue-500 hover:text-blue-700 text-sm">Read More</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <Link href="/blog/all-blogs" className="inline-flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
          More...
        </Link>
      </div>
    </section> </>
  );
};

export default Blog;
