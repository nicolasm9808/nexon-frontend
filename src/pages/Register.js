import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  // Asegúrate de importar correctamente
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de importar los estilos

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Validación de formulario
  const validateForm = () => {
    console.log("Validating form...");

    if (!fullName) {
      toast.error('Full name is required', { position: 'top-center'});
      return false;
    }
    if (!username) {
      toast.error('Username is required', { position: 'top-center'});
      return false;
    }
    if (!phoneNumber || !/^(\+?\d{10,15})$/.test(phoneNumber)) {
      toast.error('Invalid phone number. It should be between 10 to 15 digits.', {position: 'top-center'});
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email address', { position: 'top-center'});
      return false;
    }
    if (!password || !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@$%^&*()_+={}\[\]:";\'<>,.?/]).{8,12}$/.test(password)) {
      toast.error('Password must contain 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character. Length 8-12 characters.', {position: 'top-center'});
      return false;
    }
    if (!dateOfBirth || new Date(dateOfBirth) >= new Date()) {
      toast.error('Date of birth must be in the past and you must be at least 14 years old.', {position: 'top-center'});
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Handling registration...");  // Verifica que se llame a esta función

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
        toast.success('Registration successful! Please login.', {position: 'top-center'});
        navigate('/login');
      }
    } catch (err) {
      console.error("Registration error:", err);  // Log de error
      const errorMessage = err.response?.data?.message || 'Error during registration';
      toast.error(errorMessage, {position: 'top-center'});
      setError(errorMessage);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
