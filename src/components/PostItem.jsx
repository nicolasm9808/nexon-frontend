import React, { useState, useEffect } from "react";
import { getAuthenticatedUser } from "../services/authService"; // Nueva función para obtener el usuario autenticado

const PostItem = ({ post, onEdit }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthenticatedUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const isOwner = currentUser && currentUser.id === post.user.id;

  return (
    <div className="post-item">
      <h3>{post.user.fullName}</h3>
      <p>{post.text}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
      <div>
        <span>👍 {post.totalLikes}</span> | <span>💬 {post.totalComments}</span>
      </div>
      
      {isOwner && <button onClick={() => onEdit(post)}>✏️ Editar</button>}
    </div>
  );
};

export default PostItem;
