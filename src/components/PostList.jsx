import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import EditPostModal from "./EditPostModal";
import { fetchPosts, fetchFeed, updatePost } from "../services/postService";
import { toast } from "react-toastify";

const PostList = ({ newPosts }) => {
  const [posts, setPosts] = useState([]);
  const [orderBy, setOrderBy] = useState("desc");
  const [isFeed, setIsFeed] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      const data = isFeed ? await fetchFeed() : await fetchPosts(orderBy);
      setPosts(data);
    };
    loadPosts();
  }, [orderBy, isFeed]);

  useEffect(() => {
    if (newPosts.length > 0) {
      setPosts((prevPosts) => {
        const newPostIds = newPosts.map((p) => p.id);
        const filteredPosts = prevPosts.filter((p) => !newPostIds.includes(p.id));
        return [...newPosts, ...filteredPosts];
      });
    }
  }, [newPosts]);
  

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
  };

  const handleSave = async (updatedData) => {
    if (editingPost) {
      try {
        const updatedPost = await updatePost(editingPost.id, updatedData);
  
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === editingPost.id ? updatedPost : p))
        );
  
        toast.success("Publicación actualizada correctamente");
        setEditingPost(null);
      } catch (error) {
        console.error("Error updating post:", error);
        toast.error("Error al actualizar la publicación");
      }
    }
  };
  
  
  

  // 🔄 Función para actualizar un post cuando cambia su número de likes o comentarios
  const handlePostUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  return (
    <div>
      <div>
        <button onClick={() => setOrderBy("desc")}>⏬ Más Recientes</button>
        <button onClick={() => setOrderBy("asc")}>⏫ Más Antiguos</button>
        <button onClick={() => setOrderBy("relevance")}>🔥 Relevantes</button>
        <button onClick={() => setIsFeed(!isFeed)}>
          {isFeed ? "🌎 Ver Todo" : "👥 Ver Feed"}
        </button>
      </div>

      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdate={handlePostUpdate}
        />
      ))}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PostList;
