const Header = ({ setIsAuthenticated }) => {
    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    };
  
    return (
      <header>
        <button onClick={handleLogout}>Logout</button>
      </header>
    );
  };
  