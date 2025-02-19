import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAuthenticatedUser } from "../services/authService";
import { deletePost } from "../services/postService";
import { getUsersWhoLikedPost, toggleLike } from "../services/likeService";
import { getCommentsByPost, addComment, deleteComment } from "../services/commentService";
import { toast } from "react-toastify";

// Estilos para la publicación
const PostContainer = styled.div`
  background: ${({ theme }) => (theme.darkMode ? "#222" : "#fff")};
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;
const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const UserName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => (theme.darkMode ? "#fff" : "#333")};
`;

const PostText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => (theme.darkMode ? "#ddd" : "#444")};
  margin-bottom: 10px;
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => (theme.darkMode ? "#444" : "#ddd")};
`;

const ActionButton = styled.span`
  cursor: pointer;
  font-size: 16px;
  color: ${({ theme, $active }) => ($active ? "red" : theme.darkMode ? "#bbb" : "#333")};
  margin-right: 10px;
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: scale(1.1);
    color: ${({ theme }) => (theme.darkMode ? "#fff" : "#000")};
  }
`;

const NumberButton = styled.span`
  cursor: pointer;
  font-size: 16px;
  color: ${({ theme, $active }) => ($active ? "red" : theme.darkMode ? "#bbb" : "#333")};
  margin-right: 10px;
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: scale(1.1);
    color: ${({ theme }) => (theme.darkMode ? "#fff" : "#000")};
  }
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => (theme.darkMode ? "#444" : "#ccc")};
  border-radius: 8px;
  background: ${({ theme }) => (theme.darkMode ? "#333" : "#f9f9f9")};
  color: ${({ theme }) => (theme.darkMode ? "#fff" : "#000")};
  font-size: 14px;

  &:focus {
    outline: 2px solid ${({ theme }) => (theme.darkMode ? "#007bff" : "#0056b3")};
  }
`;

const CommentButton = styled.button`
  background: ${({ theme }) => (theme.darkMode ? "#007bff" : "#0056b3")};
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => (theme.darkMode ? "#0056b3" : "#003f7f")};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

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
    <PostContainer>
      <PostHeader>
        <UserName>{post.user.fullName}</UserName>
      </PostHeader>
      <PostText>{post.text}</PostText>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" />}

      <PostActions>

        <ActionButton onClick={handleLike} $active={hasLiked}>
          {hasLiked ? "❤️" : "🤍"} 
          {
            <ActionButton onClick={fetchLikes} $active={hasLiked}>
              {post.totalLikes} Likes
            </ActionButton>
          }
        </ActionButton>
        <ActionButton onClick={fetchComments}>
          💬 {post.totalComments}
        </ActionButton>
      </PostActions>

      <form onSubmit={handleCommentSubmit} style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <CommentInput 
          type="text" 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          required
        />
        <CommentButton type="submit">Comentar</CommentButton>
      </form>

      {isOwner && (
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <CommentButton  onClick={() => onEdit(post)}>✏️ Editar</CommentButton>
          <CommentButton  onClick={handleDelete} style={{ background: "red" }}>
            🗑️ Eliminar
          </CommentButton>
        </div>
      )}

      {likesModalOpen && (
        <div style={{ marginTop: "10px", gap: "10px" }}>
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
    </PostContainer>
  );
};

export default PostItem;
