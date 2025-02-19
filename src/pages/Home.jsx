import React, { useState } from "react";
import styled from "styled-components";
import PostList from "../components/PostList";
import CreatePostForm from "../components/CreatePostForm";

const HomeContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => (theme.darkMode ? "#1E1E1E" : "#ffffff")};
  color: ${({ theme }) => (theme.darkMode ? "#ffffff" : "#000000")};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Home = () => {
  const [posts, setPosts] = useState([]);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <HomeContainer>
      <Title>📢 Inicio</Title>
      <CreatePostForm onPostCreated={handleNewPost} />
      <PostList newPosts={posts} />
    </HomeContainer>
  );
};

export default Home;
