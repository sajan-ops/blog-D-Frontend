"use client";
import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'next-share';
import { frontendUrl } from '@/lib/apiConfig';

const SharePost = ({ title, url }) => {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center text-gray-800">Share post on:</h2>
      <div className="flex justify-center space-x-4 mt-4">
        <FacebookShareButton url={`${frontendUrl}/blog/${url}`} quote={title} className="hover:scale-110 transition-transform duration-200">
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        <TwitterShareButton url={`${frontendUrl}/blog/${url}`} title={title} className="hover:scale-110 transition-transform duration-200">
          <TwitterIcon size={40} round />
        </TwitterShareButton>
        <LinkedinShareButton url={`${frontendUrl}/blog/${url}`} className="hover:scale-110 transition-transform duration-200">
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>
      </div>
    </div>
  );
};

export default SharePost;
