import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs Page 4 - Traffic & Social Features",
  description: "Documentation for Traffic and Social Media Features",
};

const Page4 = () => {
  return (
    <div>
      <div className="w-full px-4 lg:w-3/4">
        <div className="blog-details blog-details-docs shadow-three dark:bg-gray-dark rounded-sm bg-white px-8">
          <h1>Traffic, Reach & Social Features</h1>
          <p className="text-body-color dark:text-body-color-dark text-base">
            <b>Overview:</b> This section describes traffic analysis tools,
            social media sharing, and post engagement features.
          </p>
          <h2>Features:</h2>
          <ul className="text-body-color dark:text-body-color-dark list-disc pl-5 text-base">
            <li>
              Traffic charts for organic, social, and referral traffic analysis.
            </li>
            <li>
              Post engagement features, including likes and comments with
              real-time updates.
            </li>
            <li>Offline mode support for seamless PWA experience.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page4;
