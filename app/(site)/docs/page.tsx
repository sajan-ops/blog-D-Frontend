import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs Page 1 - User Authentication & Admin Login",
  description:
    "Documentation for User Authentication and Admin Login functionality",
};

const Page1 = () => {
  return (
    <div>
      <div className="w-full px-4 lg:w-3/4">
        <div className="blog-details blog-details-docs shadow-three dark:bg-gray-dark rounded-sm bg-white px-8">
          <h1>User Authentication & Admin Login</h1>
          <p className="text-body-color dark:text-body-color-dark text-base">
            <b>Overview:</b> This section covers the authentication and login
            features implemented for Admins, including email/username login and
            optional multi-factor authentication.
          </p>
          <h2>Features:</h2>
          <ul className="text-body-color dark:text-body-color-dark list-disc pl-5 text-base">
            <li>Email/username and password login for Admins.</li>
            <li>Optional multi-factor authentication for enhanced security.</li>
            <li>Secure session management with JSON Web Tokens (JWT).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page1;
