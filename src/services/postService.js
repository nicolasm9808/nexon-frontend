import axios from "axios";

const token = localStorage.getItem("token");
const API_URL = "http://localhost:8081/api/posts";

export const fetchPosts = async (orderBy) => {
  const response = await axios.get(`${API_URL}/all`, {
    headers: {
        Authorization: `Bearer ${token}`,
      },
    params: { orderBy },
  });
  return response.data;
};

export const fetchFeed = async () => {
  const response = await axios.get(`${API_URL}/feed`, {
    headers: {
        Authorization: `Bearer ${token}`,
      },
  });
  return response.data;
};

export const updatePost = async (postId, updatedData) => {
  const response = await axios.patch(
    `${API_URL}/${postId}`,
    updatedData,{
      headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
  
export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};