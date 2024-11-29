import { Metadata } from "next";

export const metadata = {
  title: "Docs Page 2 - Post & Media Management",
  description: "Documentation for Post and Media Management features",
};

const Page2 = () => {
  return (
    <div>
      <div className="w-full px-4 lg:w-3/4">
        <div className="blog-details blog-details-docs shadow-three dark:bg-gray-dark rounded-sm bg-white px-8">
          <h1>Post & Media Management</h1>
          <p className="text-body-color dark:text-body-color-dark text-base">
            <b>Overview:</b> This section details CRUD operations for blog posts
            and media management capabilities.
          </p>
          <h2>Features:</h2>
          <ul className="text-body-color dark:text-body-color-dark list-disc pl-5 text-base">
            <li>
              Create, edit, and delete blog posts with full draft and published
              status management.
            </li>
            <li>Rich-text editor with image and media embed support.</li>
            <li>Media gallery for browsing, selecting, and deleting files.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page2;
