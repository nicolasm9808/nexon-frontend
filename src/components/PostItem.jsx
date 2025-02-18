import React, { useState, useEffect } from "react";
import { getAuthenticatedUser } from "../services/authService";
import { deletePost } from "../services/postService";
import { getUsersWhoLikedPost } from "../services/likeService";
import { getCommentsByPost } from "../services/commentService";
import { toast } from "react-toastify";

const PostItem = ({ post, onEdit, onDelete }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [commentsList, setCommentsList] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthenticatedUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const isOwner = currentUser && currentUser.id === post.user.id;

  // Obtener lista de usuarios que dieron like
  const fetchLikes = async () => {
    try {
      const users = await getUsersWhoLikedPost(post.id);
      setLikesList(users);
      setLikesModalOpen(true);
    } catch (error) {
      toast.error("Error al obtener los likes");
    }
  };

  // Obtener lista de comentarios
  const fetchComments = async () => {
    try {
      const comments = await getCommentsByPost(post.id);
      setCommentsList(comments);
      setCommentsModalOpen(true);
    } catch (error) {
      toast.error("Error al obtener los comentarios");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      try {
        await deletePost(post.id);
        toast.success("Publicación eliminada correctamente");
        onDelete(post.id);
      } catch (error) {
        toast.error("Error al eliminar la publicación");
      }
    }
  };

  return (
    <div className="post-item">
      <h3>{post.user.fullName}</h3>
      <p>{post.text}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
      
      {/* Botones de interacciones */}
      <div>
        <span onClick={fetchLikes} style={{ cursor: "pointer", color: "blue" }}>
          👍 {post.totalLikes} Likes
        </span> | 
        <span onClick={fetchComments} style={{ cursor: "pointer", color: "blue", marginLeft: "10px" }}>
          💬 {post.totalComments} Comments
        </span>
      </div>

      {/* Botones de edición/eliminación */}
      {isOwner && (
        <div>
          <button onClick={() => onEdit(post)}>✏️ Editar</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
            🗑️ Eliminar
          </button>
        </div>
      )}

      {/* Modal para mostrar los usuarios que dieron like */}
      {likesModalOpen && (
        <div className="modal">
          <h3>Usuarios que dieron like</h3>
          <ul>
            {likesList.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
          <button onClick={() => setLikesModalOpen(false)}>Cerrar</button>
        </div>
      )}

      {/* Modal para mostrar los comentarios */}
      {commentsModalOpen && (
        <div className="modal">
          <h3>Comentarios</h3>
          <ul>
            {commentsList.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.user.username}:</strong> {comment.text}
              </li>
            ))}
          </ul>
          <button onClick={() => setCommentsModalOpen(false)}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default PostItem;
