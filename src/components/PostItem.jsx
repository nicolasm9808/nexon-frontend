import React, { useState, useEffect } from "react";
import { getAuthenticatedUser } from "../services/authService";
import { deletePost } from "../services/postService";
import { getUsersWhoLikedPost, toggleLike } from "../services/likeService";
import { getCommentsByPost, addComment, deleteComment } from "../services/commentService";
import { toast } from "react-toastify";

const PostItem = ({ post: initialPost, onEdit, onDelete, onUpdate }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [post, setPost] = useState(initialPost);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  const [hasLiked, setHasLiked] = useState(initialPost.likedByCurrentUser || false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getAuthenticatedUser();
        setCurrentUser(user);

        // Obtener la lista de likes
        const usersWhoLiked = await getUsersWhoLikedPost(initialPost.id);
        setLikesList(usersWhoLiked);

        // Verificar si el usuario actual está en la lista de likes
        const userHasLiked = usersWhoLiked.some((likedUser) => likedUser.id === user.id);
        setHasLiked(userHasLiked);
      } catch (error) {
        toast.error("Error al cargar los datos del post");
      }
    };

    fetchData();
  }, [initialPost.id]);

  const isOwner = currentUser && currentUser.id === post.user.id;

  const fetchLikes = async () => {
    try {
      const users = await getUsersWhoLikedPost(post.id);
      setLikesList(users);
      setLikesModalOpen(true);
    } catch (error) {
      toast.error("Error al obtener los likes");
    }
  };

  const fetchComments = async () => {
    try {
      const comments = await getCommentsByPost(post.id);
      setCommentsList(comments);
      setCommentsModalOpen(true);
    } catch (error) {
      toast.error("Error al obtener los comentarios");
    }
  };

  const handleLike = async () => {
    try {
      const liked = await toggleLike(post.id);
  
      setLikesList((prevLikes) => 
        liked ? [...prevLikes, currentUser] : prevLikes.filter((user) => user.id !== currentUser.id)
      );
  
      setHasLiked(liked);
  
      setPost((prevPost) => ({
        ...prevPost,
        totalLikes: liked ? prevPost.totalLikes + 1 : prevPost.totalLikes - 1,
        likedByCurrentUser: liked,
      }));
  
      onUpdate((prevPost) => ({
        ...prevPost,
        totalLikes: liked ? prevPost.totalLikes + 1 : prevPost.totalLikes - 1,
        likedByCurrentUser: liked,
      }));
    } catch (error) {
      toast.error("Error al dar like");
    }
  };
  
  

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
  
    try {
      const comment = await addComment(post.id, newComment);
      setCommentsList((prevComments) => [...prevComments, comment]);
      setNewComment("");
  
      setPost((prevPost) => ({
        ...prevPost,
        totalComments: prevPost.totalComments + 1,
      }));
  
      onUpdate((prevPost) => ({
        ...prevPost,
        totalComments: prevPost.totalComments + 1,
      }));
    } catch (error) {
      toast.error("Error al agregar el comentario");
    }
  };
  

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) return;

    try {
      await deleteComment(commentId);
      setCommentsList(commentsList.filter((comment) => comment.id !== commentId));

      setPost((prevPost) => ({
        ...prevPost,
        totalComments: prevPost.totalComments - 1,
      }));

      onUpdate({ ...post, totalComments: post.totalComments - 1 });

      toast.success("Comentario eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el comentario");
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

      <div>
        <span onClick={fetchLikes} style={{ cursor: "pointer", color: "blue" }}>
          {post.totalLikes} Likes
        </span>
        <span 
          onClick={handleLike} 
          style={{ cursor: "pointer", marginLeft: "10px", color: hasLiked ? "red" : "black" }}
        >
          {hasLiked ? "❤️" : "🤍"}
        </span>
        |
        <span onClick={fetchComments} style={{ cursor: "pointer", color: "blue", marginLeft: "10px" }}>
          💬 {post.totalComments} Comments
        </span>
      </div>

      <form onSubmit={handleCommentSubmit} style={{ marginTop: "10px" }}>
        <input 
          type="text" 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          required
        />
        <button type="submit">Comentar</button>
      </form>

      {isOwner && (
        <div>
          <button onClick={() => onEdit(post)}>✏️ Editar</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
            🗑️ Eliminar
          </button>
        </div>
      )}

      {likesModalOpen && (
        <div className="modal">
          <h3>Usuarios que dieron like</h3>
          <ul>
            {likesList.length > 0 ? (
              likesList.map((user, index) => (
              <li key={index}>{user}</li>
              ))
            ) : (
              <p>No hay likes aún</p>
            )}
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
                {(currentUser?.id === comment.user.id || isOwner) && (
                  <button onClick={() => handleDeleteComment(comment.id)} style={{ marginLeft: "10px", color: "red" }}>
                    🗑️
                  </button>
                )}
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
