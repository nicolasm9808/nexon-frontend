import React, { useState, useEffect } from "react";
import { getAuthenticatedUser } from "../services/authService";
import { deletePost } from "../services/postService";
import { toast } from "react-toastify";

const PostItem = ({ post, onEdit, onDelete }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthenticatedUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const isOwner = currentUser && currentUser.id === post.user.id;

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
      <div>
        <span>👍 {post.totalLikes}</span> | <span>💬 {post.totalComments}</span>
      </div>

      {isOwner && (
        <div>
          <button onClick={() => onEdit(post)}>✏️ Editar</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default PostItem;
