// All API CALLS.

import { apiUrl } from "@/lib/apiConfig";
import axios from "axios";

const fetchUsersPosts = async (filter: any, filterType: any) => {
  try {
    let type = "instant";
    const { data } = await axios.get<any>(
      `${apiUrl}/user/post/getAllposts/${type}?filterType=${filterType}&filter=${filter}`,

    ); // Adjust the URL based on your API
    // console.log("data>>", data);
    if (data.success) {
      return data.rows
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};


const fetchRelatedPosts = async (category: string) => {
  try {
    let type = "instant";
    const { data } = await axios.get<any>(
      `${apiUrl}/user/post/getRelatedposts/${category}`,

    ); // Adjust the URL based on your API
    // console.log("data>>", data);
    if (data.success) {
      return data.rows
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};



const fetchPostDetails = async (slug: any) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/user/post/getSinglePost/${slug}`
    );
    if (data.success) {
      return data.post
    }
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
};

export { fetchUsersPosts, fetchPostDetails, fetchRelatedPosts }