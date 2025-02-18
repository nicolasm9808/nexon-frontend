import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth/';

const login = (username, password) => {
  return axios
    .post(API_URL + 'login', { username, password })
    .then(response => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  login,
  logout,
  getCurrentUser,
};

export const getAuthenticatedUser = async () => {
    const response = await axios.get('http://localhost:8081/api/users/me', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        });
    return response.data;
  };