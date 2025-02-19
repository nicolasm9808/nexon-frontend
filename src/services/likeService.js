import axios from "axios";

const API_URL = "http://localhost:8081/api/likes";

export const getUsersWhoLikedPost = async (postId) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token en cada request
    const response = await axios.get(`${API_URL}/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los likes:", error);
    throw error;
  }
};

export const toggleLike = async (postId) => {
  try {
    const token = localStorage.getItem("token"); // Obtener el token en cada request
    const response = await axios.post(
      `${API_URL}/${postId}`,
      {}, // 👈 El `body` debe ser un objeto vacío si no envías datos
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data === "Liked"; // Verificar la respuesta del backend
  } catch (error) {
    console.error("Error al alternar like:", error);
    throw error;
  }
};
