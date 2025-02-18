import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GlobalStyle } from './assets/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { ThemeContext } from "./context/ThemeContext"; 
import "./styles/index.css";
import "./styles/App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Definir el tema para styled-components
  const theme = {
    darkMode,
  };

  // Obtener autenticación directamente del localStorage
  const getAuthStatus = () => !!localStorage.getItem('token');
  
  // Estado de autenticación basado en localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(getAuthStatus);

  // Listener para detectar cambios en localStorage y actualizar autenticación
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(getAuthStatus());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ThemeToggle /> {/* Botón para cambiar de modo */}
        <Router>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
