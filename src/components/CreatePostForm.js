import React, { useState } from "react";
import styled from "styled-components";
import { createPost } from "../services/postService";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  background: ${({ theme }) => (theme.darkMode ? "#222" : "#fff")};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 500px;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => (theme.darkMode ? "#333" : "#f9f9f9")};
  color: ${({ theme }) => (theme.darkMode ? "#fff" : "#000")};
  font-size: 16px;
  resize: none;
  height: 100px;

  &::placeholder {
    color: ${({ theme }) => (theme.darkMode ? "#bbb" : "#666")};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => (theme.darkMode ? "#007bff" : "#0056b3")};
  }
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => (theme.darkMode ? "#333" : "#f9f9f9")};
  color: ${({ theme }) => (theme.darkMode ? "#fff" : "#000")};
  font-size: 16px;

  &::placeholder {
    color: ${({ theme }) => (theme.darkMode ? "#bbb" : "#666")};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => (theme.darkMode ? "#007bff" : "#0056b3")};
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => (theme.darkMode ? "#007bff" : "#0056b3")};
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => (theme.darkMode ? "#0056b3" : "#003f7f")};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CreatePostForm = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim().length < 5) {
      toast.error("El texto debe tener al menos 5 caracteres.");
      return;
    }

    try {
      const newPost = await createPost({ text, imageUrl });
      setText("");
      setImageUrl("");
      toast.success("Post creado con éxito!");
      onPostCreated(newPost); // Actualizar la lista de posts en tiempo real
    } catch (error) {
      toast.error("Error al crear el post.");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="¿Qué estás pensando?"
        required
      />
      <Input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="URL de imagen (opcional)"
      />
      <SubmitButton type="submit">📢 Publicar</SubmitButton>
    </FormContainer>
  );
};

export default CreatePostForm;
