import { Metadata } from "next";

export const metadata = {
  title: "Docs Page 3 - SEO Tools & Analytics",
  description:
    "Documentation for SEO Tools, Social Media, and Analytics features",
};

const Page3 = () => {
  return (
    <div>
      <div className="w-full px-4 lg:w-3/4">
        <div className="blog-details blog-details-docs shadow-three dark:bg-gray-dark rounded-sm bg-white px-8">
          <h1>SEO Tools, Social Media Reach & Analytics</h1>
          <p className="text-body-color dark:text-body-color-dark text-base">
            <b>Overview:</b> This section covers SEO optimization, social media
            integration, and analytics tools.
          </p>
          <h2>Features:</h2>
          <ul className="text-body-color dark:text-body-color-dark list-disc pl-5 text-base">
            <li>Meta information management for improved SEO.</li>
            <li>
              Google Search Console integration with crawl statistics and search
              performance data.
            </li>
            <li>
              Analytics integration with Google Analytics for tracking traffic,
              behavior, and performance.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page3;
