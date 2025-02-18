import axios from "axios";

const token = localStorage.getItem("token");
const API_URL = "http://localhost:8081/api/likes";

/**
 * Obtiene la lista de usuarios que dieron like a un post.
 * @param {number} postId - ID del post.
 * @returns {Promise<string[]>} - Lista de usuarios que dieron like.
 */
export const getUsersWhoLikedPost = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data; // Retorna un array con los nombres de usuario
  } catch (error) {
    console.error("Error al obtener los likes:", error);
    throw error;
  }
};
