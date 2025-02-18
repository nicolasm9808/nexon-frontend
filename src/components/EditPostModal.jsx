import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ darkMode }) => (darkMode ? "#1e1e1e" : "#fff")};
  color: ${({ darkMode }) => (darkMode ? "#fff" : "#000")};
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: ${({ darkMode }) => (darkMode ? "#2c2c2c" : "#fff")};
  color: ${({ darkMode }) => (darkMode ? "#fff" : "#000")};
  resize: none;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: ${({ darkMode }) => (darkMode ? "#2c2c2c" : "#fff")};
  color: ${({ darkMode }) => (darkMode ? "#fff" : "#000")};
  margin-bottom: 10px;
`;

const Button = styled.button`
  background-color: ${({ $primary, darkMode }) =>
    $primary ? (darkMode ? "#333" : "#007bff") : (darkMode ? "#444" : "#ccc")};
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  width: 48%;
  transition: 0.3s;

  &:hover {
    background-color: ${({ $primary, darkMode }) =>
      $primary ? (darkMode ? "#444" : "#0056b3") : (darkMode ? "#555" : "#999")};
  }
`;


const EditPostModal = ({ post, onClose, onSave, darkMode }) => {
  const [text, setText] = useState(post.text || "");
  const [imageUrl, setImageUrl] = useState(post.imageUrl || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setText(post.text || "");
    setImageUrl(post.imageUrl || "");
  }, [post]);

  const handleSubmit = () => {
    if (text.length < 5 || text.length > 500) {
      setError("El texto debe tener entre 5 y 500 caracteres.");
      return;
    }
    setError("");
    onSave({ text, imageUrl });
    onClose();
  };

  return (
    <ModalWrapper>
      <ModalContent darkMode={darkMode}>
        <h2>Editar Publicación</h2>
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        <TextArea
          darkMode={darkMode}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Input
          darkMode={darkMode}
          type="text"
          placeholder="URL de la imagen (opcional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button darkMode={darkMode} $primary onClick={handleSubmit}>
          Guardar
        </Button>
        <Button darkMode={darkMode} onClick={onClose}>
          Cancelar
        </Button>
        </div>
      </ModalContent>
    </ModalWrapper>
  );
};

export default EditPostModal;
