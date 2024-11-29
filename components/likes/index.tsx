"use client";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import { apiUrl } from "@/lib/apiConfig";
import toast from "react-hot-toast";
import { useSocket } from "@/app/(site)/layout";

const LikeButton = ({ initialLiked, postId }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  let socketio: any = useSocket();
  // Fetch the initial likes count when the component mounts
  useEffect(() => {
    if (socketio) {
      socketio.on("postLiked", async ({ success }) => {
        if (success) {
          await fetchLikesCount();
        }
      });
    }
  }, [socketio]);
  useEffect(() => {
    fetchLikesCount();
  }, []);

  const fetchLikesCount = async () => {
    const token = localStorage.getItem("userToken"); // Get the token from localStorage
    try {
      const { data } = await axios.get(
        `${apiUrl}/user/post/likesCount/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        },
      );
      if (data.success) {
        setLikesCount(data.data.postlikes.postLikes); // Adjust based on your API response
      }
    } catch (error) {
      console.error("Error fetching likes count:", error);
    }
  };
  const handleLike = async () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    const token = localStorage.getItem("userToken"); // Get token from localStorage
    try {
      // Make an API call to like/unlike the post using Axios
      let { data } = await axios.post(
        `${apiUrl}/user/post/likePost`,
        { postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        },
      );
      await fetchLikesCount();
    } catch (error) {
      console.error("Error liking the post:", error);
      // Optionally handle the error (e.g., show an error message)
      // Handle error here
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        console.error("Error Status Code:", error.response?.status);
        if (error.response?.status == 429) {
          toast("Your reacts are beyond the limit! Please wait.");
          setTimeout(() => {
            toast.dismiss();
          }, 2000);
        } // Get the status code from the error response
        console.error("Error Message:", error.message);
      } else {
        // Non-Axios error handling
        console.error("Unexpected Error:", error);
      }
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`
        group
        flex items-center gap-2
        rounded-full px-4
        py-2
        transition-all duration-300 ease-in-out
        ${
          isLiked
            ? "bg-gray-50 hover:bg-gray-100"
            : "bg-gray-50 hover:bg-gray-100"
        }
        focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
      `}
    >
      <Heart
        className={`
          transition-all duration-300
          ${
            isLiked
              ? "fill-gray-300 stroke-gray-300"
              : "stroke-gray-400 group-hover:stroke-gray-500"
          }
          ${isAnimating ? "scale-125" : "scale-100"}
        `}
        size={20}
      />
      <span
        className={`
          font-medium
          ${
            isLiked
              ? "text-gray-500"
              : "text-gray-600 group-hover:text-gray-500"
          }
        `}
      >
        {isLiked ? "Liked" : "Like"}
      </span>
      {/* Display the number of likes */}
      <span className="text-gray-600">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
