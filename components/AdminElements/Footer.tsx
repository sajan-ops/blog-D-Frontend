import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 w-full bg-gray-800 py-1 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-4 md:mb-0">
          <p className="m-auto text-center text-sm">
            © {currentYear} MyAdmin Panel
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
