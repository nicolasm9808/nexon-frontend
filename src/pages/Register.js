import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e1e, #3a3a3a);
`;

const RegisterBox = styled.div`
  background: #222;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%;
  max-width: 450px;
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

const LoginLink = styled.p`
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

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!fullName) {
      toast.error('Full name is required');
      return false;
    }
    if (!username) {
      toast.error('Username is required');
      return false;
    }
    if (!phoneNumber || !/^(\+?\d{10,15})$/.test(phoneNumber)) {
      toast.error('Invalid phone number');
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email address');
      return false;
    }
    if (!password || !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@$%^&*()_+={}\[\]:";\'<>,.?/]).{8,12}$/.test(password)) {
      toast.error('Password must contain uppercase, lowercase, number, and special character.');
      return false;
    }
    if (!dateOfBirth || new Date(dateOfBirth) >= new Date()) {
      toast.error('Invalid date of birth.');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:8081/api/users/register', {
        fullName,
        username,
        phoneNumber,
        email,
        password,
        dateOfBirth,
      });

      if (response.status === 201) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || 'Error during registration';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <Title>📝 Registrarse</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleRegister}>
          <Input 
            type="text" 
            placeholder="Nombre Completo" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required 
          />
          <Input 
            type="text" 
            placeholder="Usuario" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <Input 
            type="text" 
            placeholder="Teléfono" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required 
          />
          <Input 
            type="email" 
            placeholder="Correo Electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Input 
            type="date" 
            placeholder="Fecha de Nacimiento" 
            value={dateOfBirth} 
            onChange={(e) => setDateOfBirth(e.target.value)} 
            required 
          />
          <Button type="submit">Registrarse</Button>
        </Form>
        <LoginLink>
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </LoginLink>
      </RegisterBox>
    </RegisterContainer>
  );
};

export default Register;
