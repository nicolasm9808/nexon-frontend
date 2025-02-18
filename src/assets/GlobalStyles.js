import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => (theme.darkMode ? "#121212" : "#ffffff")};
    color: ${({ theme }) => (theme.darkMode ? "#ffffff" : "#000000")};
    font-family: "Arial", sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  button {
    background-color: ${({ theme }) => (theme.darkMode ? "#333" : "#007bff")};
    color: ${({ theme }) => (theme.darkMode ? "#ffffff" : "white")};
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
  }

  button:hover {
    background-color: ${({ theme }) => (theme.darkMode ? "#444" : "#0056b3")};
  }
`;
