import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    fullName: '',
    phoneNumber: '',
    bio: '',
    profilePicture: ''
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Cargar los datos del usuario autenticado
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setUser(response.data);
        setUpdatedInfo({
          fullName: response.data.fullName,
          phoneNumber: response.data.phoneNumber,
          bio: response.data.bio,
          profilePicture: response.data.profilePicture
        });
      } catch (err) {
        toast.error('Error fetching user data', { position: 'top-center' });
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8081/api/users/${user.id}`,
        updatedInfo,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Profile updated successfully', { position: 'top-center' });
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      toast.error('Error updating profile', { position: 'top-center' });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Account deleted successfully', { position: 'top-center' });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      toast.error('Error deleting account', { position: 'top-center' });
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <div>
        {isEditing ? (
          <>
            <input
              type="text"
              name="fullName"
              value={updatedInfo.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
            />
            <input
              type="text"
              name="phoneNumber"
              value={updatedInfo.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <input
              type="text"
              name="bio"
              value={updatedInfo.bio}
              onChange={handleInputChange}
              placeholder="Bio"
            />
            <input
              type="text"
              name="profilePicture"
              value={updatedInfo.profilePicture}
              onChange={handleInputChange}
              placeholder="Profile Picture URL"
            />
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
            <p><strong>Bio:</strong> {user.bio}</p>
            <img src={user.profilePicture} alt="Profile" width="100" />
            <button onClick={handleEdit}>Edit</button>
          </>
        )}
      </div>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default Profile;
