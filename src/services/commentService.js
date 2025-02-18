import axios from "axios";

const token = localStorage.getItem("token");
const API_URL = "http://localhost:8081/api/comments";

/**
 * Obtiene la lista de comentarios de un post.
 * @param {number} postId - ID del post.
 * @returns {Promise<Object[]>} - Lista de comentarios.
 */
export const getCommentsByPost = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data; // Retorna un array de objetos de comentarios
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    throw error;
  }
};
