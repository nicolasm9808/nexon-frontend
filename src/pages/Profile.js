import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/api/users/me')
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      <img src={user.profileImage} alt="Profile" />
    </div>
  );
};

export default Profile;
