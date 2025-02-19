import axios from "axios";

const API_URL = "http://localhost:8081/api/comments";

export const getCommentsByPost = async (postId) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token en cada request
    const response = await axios.get(`${API_URL}/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    throw error;
  }
};

export const addComment = async (postId, text) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token en cada request
    const response = await axios.post(
      `${API_URL}/${postId}`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al agregar el comentario:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token"); // Obtener el token en cada request
      const response = await axios.delete(
        `${API_URL}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
      throw error;
    }
  };