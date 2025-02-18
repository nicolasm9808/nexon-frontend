const Header = () => {
    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/login');
    };
  
    return (
      <header>
        <button onClick={handleLogout}>Logout</button>
      </header>
    );
  };
  