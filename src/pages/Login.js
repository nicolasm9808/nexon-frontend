import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        username,
        password,
      });

      if (response.data.startsWith('Bearer ')) {
        const token = response.data.split(' ')[1];
        localStorage.setItem('token', token);
        
        setIsAuthenticated(true); // Establecer el estado de autenticación
        window.dispatchEvent(new Event("storage"));  // Notificar cambios en localStorage
        navigate('/'); // Redirigir al Home
      } else {
        toast.error('Invalid credentials'); // Mensaje de error
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Error logging in. Please try again.'); // Mensaje de error
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
};

export default Login;
