import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";
import axios from "axios";
import styled from "styled-components";
import { FaHome, FaSearch, FaBell, FaUserCircle, FaBars, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: ${({ theme }) => (theme.darkMode ? "#1E1E1E" : "#ffffff")};
  color: ${({ theme }) => (theme.darkMode ? "#ffffff" : "#000000")};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const NavIcon = styled(Link)`
  color: inherit;
  text-decoration: none;
  font-size: 24px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => (theme.darkMode ? "#BBBBBB" : "#007bff")};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${({ theme }) => (theme.darkMode ? "#333" : "#f0f0f0")};
  padding: 5px 10px;
  border-radius: 20px;
`;

const SearchBar = styled.input`
  padding: 8px;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => (theme.darkMode ? "#ffffff" : "#000000")};

  &::placeholder {
    color: ${({ theme }) => (theme.darkMode ? "#888" : "#666")};
  }
`;

const ProfileCircle = styled(Link)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ theme }) => (theme.darkMode ? "#ffffff" : "#000000")};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.darkMode ? "#333" : "#f0f0f0")};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    font-size: 32px;
    color: ${({ theme }) => (theme.darkMode ? "#ffffff" : "#000000")};
  }
`;

const MenuContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: ${({ theme }) => (theme.darkMode ? "#1E1E1E" : "#ffffff")};
  color: ${({ theme }) => (theme.darkMode ? "#ffffff" : "#000000")};
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  min-width: 150px;
  z-index: 100;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  gap: 10px;

  &:hover {
    background-color: ${({ theme }) => (theme.darkMode ? "#333" : "#f0f0f0")};
  }
`;

const Navbar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileImage(response.data.profilePicture);
      } catch (err) {
        console.error("Error fetching profile picture:", err);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Sesión cerrada");
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/user/${searchTerm.trim()}`);
      setSearchTerm("");
    }
  };

  return (
    <NavbarContainer>
      {/* Icono de Home */}
      <NavIcon to="/">
        <FaHome />
      </NavIcon>

      {/* Barra de búsqueda */}
      <SearchContainer as="form" onSubmit={handleSearch}>
        <SearchBar
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" style={{ background: "none", border: "none", cursor: "pointer" }}>
          <FaSearch color={darkMode ? "#ffffff" : "#000000"} />
        </button>
      </SearchContainer>

      {/* Icono de Notificaciones */}
      <NavIcon to="/notifications">
        <FaBell />
      </NavIcon>

      {/* Icono de Perfil */}
      <ProfileCircle to="/profile">
        {profileImage ? <img src={profileImage} alt="Perfil" /> : <FaUserCircle />}
      </ProfileCircle>

      {/* Menú de Opciones */}
      <MenuContainer>
        <NavIcon as="div" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </NavIcon>
        {menuOpen && (
          <DropdownMenu>
            <MenuItem onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FaSun /> : <FaMoon />}
              Modo {darkMode ? "Claro" : "Oscuro"}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <FaSignOutAlt />
              Cerrar Sesión
            </MenuItem>
          </DropdownMenu>
        )}
      </MenuContainer>
    </NavbarContainer>
  );
};

export default Navbar;
