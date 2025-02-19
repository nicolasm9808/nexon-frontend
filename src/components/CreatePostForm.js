import React, { useState } from "react";
import { createPost } from "../services/postService";
import { toast } from "react-toastify";

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
    <form onSubmit={handleSubmit} className="create-post-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="¿Qué estás pensando?"
        required
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="URL de imagen (opcional)"
      />
      <button type="submit">📢 Publicar</button>
    </form>
  );
};

export default CreatePostForm;
