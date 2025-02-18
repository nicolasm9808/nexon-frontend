import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import EditPostModal from "./EditPostModal";
import { fetchPosts, fetchFeed, updatePost } from "../services/postService";

const PostList = () => {
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

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
  };

  const handleSave = async (updatedData) => {
    if (editingPost) {
      const updatedPost = await updatePost(editingPost.id, updatedData);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === editingPost.id ? { ...p, ...updatedPost } : p
        )
      );
      setEditingPost(null);
    }
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
        <PostItem key={post.id} post={post} onEdit={handleEdit} onDelete={handleDelete} />
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
