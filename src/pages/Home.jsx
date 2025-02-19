import React, { useState } from "react";
import PostList from "../components/PostList";
import CreatePostForm from "../components/CreatePostForm";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div>
      <h1>📢 Inicio</h1>
      <CreatePostForm onPostCreated={handleNewPost} />
      <PostList newPosts={posts} />
    </div>
  );
};

export default Home;
