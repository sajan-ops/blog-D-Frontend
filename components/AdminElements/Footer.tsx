import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-1 w-full fixed bottom-0">
      <div className="container mx-auto px-4">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-center m-auto">
            © {currentYear} MyAdmin Panel
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;