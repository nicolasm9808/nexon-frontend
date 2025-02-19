import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e1e, #3a3a3a);
`;

const LoginBox = styled.div`
  background: #222;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  color: #fff;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  background: #333;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    background: #444;
  }
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #ff4500;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #e63e00;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 0.9rem;
`;

const RegisterLink = styled.p`
  color: #aaa;
  margin-top: 1rem;

  a {
    color: #ff4500;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', { username, password });

      if (response.data.startsWith('Bearer ')) {
        const token = response.data.split(' ')[1];
        localStorage.setItem('token', token);
        
        setIsAuthenticated(true);
        window.dispatchEvent(new Event("storage"));
        navigate('/');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Error logging in. Please try again.');
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>🔐 Iniciar Sesión</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleLogin}>
          <Input 
            type="text" 
            placeholder="Usuario" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button type="submit">Ingresar</Button>
        </Form>
        <RegisterLink>
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </RegisterLink>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
