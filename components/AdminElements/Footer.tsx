import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-center m-auto">
            © {currentYear} Your Company Name. All rights reserved.
          </p>
        </div>
        <div className="mt-4 text-center text-sm text-gray-400 flex items-center justify-center">
          Made with <Heart className="text-red-500 mx-1" size={16} /> by Your Team
        </div>
      </div>
    </footer>
  );
};

export default Footer;