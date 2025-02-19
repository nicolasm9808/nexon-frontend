import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: ${({ theme }) => (theme.darkMode ? "#ffffff" : "#000000")};
`;

const ProfilePicture = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
`;

const FollowButton = styled.button`
  padding: 10px 15px;
  margin: 10px;
  background-color: ${({ following }) => (following ? "#ff4d4d" : "#4CAF50")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const FollowInfo = styled.p`
  cursor: pointer;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => (theme.darkMode ? "#222" : "#fff")};
  color: ${({ theme }) => (theme.darkMode ? "#fff" : "#000")};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  width: 100%;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [listType, setListType] = useState(""); // "followers" o "following"
  const [userList, setUserList] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/users/username/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);

        // Verificar si el usuario autenticado sigue a este perfil
        const followResponse = await axios.get(
          `http://localhost:8081/api/follow/isFollowing/${response.data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowing(followResponse.data);
      } catch (err) {
        setError("User not found");
      }
    };

    fetchUser();
  }, [username]);

  const handleFollowToggle = async () => {
    try {
      if (following) {
        await axios.delete(`http://localhost:8081/api/follow/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:8081/api/follow/${user.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFollowing(!following);
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  const fetchFollowersOrFollowing = async (type) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/follow/${type}/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserList(response.data);
      setListType(type);
      setShowModal(true);
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
    }
  };

  if (error) {
    return <ProfileContainer>{error}</ProfileContainer>;
  }

  if (!user) {
    return <ProfileContainer>Loading...</ProfileContainer>;
  }

  return (
    <ProfileContainer>
      <ProfilePicture src={user.profilePicture || "/default-avatar.png"} alt={user.fullName} />
      <h2>{user.fullName}</h2>
      <p>@{user.username}</p>
      <p>{user.bio || "No bio available"}</p>
      <p>Email: {user.email}</p>
      
      {/* Click en seguidores o seguidos */}
      <FollowInfo onClick={() => fetchFollowersOrFollowing("followers")}>
        Followers: {user.followersCount}
      </FollowInfo>
      <FollowInfo onClick={() => fetchFollowersOrFollowing("following")}>
        Following: {user.followingCount}
      </FollowInfo>

      <FollowButton following={following} onClick={handleFollowToggle}>
        {following ? "Unfollow" : "Follow"}
      </FollowButton>

      {/* Modal para mostrar seguidores/seguidos */}
      {showModal && (
        <>
          <Overlay onClick={() => setShowModal(false)} />
          <Modal>
            <h3>{listType === "followers" ? "Followers" : "Following"}</h3>
            <ul>
              {userList.length > 0 ? (
                userList.map((u) => (
                  <li key={u.id}>
                    <img
                      src={u.profilePicture || "/default-avatar.png"}
                      alt={u.username}
                      style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 10 }}
                    />
                    {u.username}
                  </li>
                ))
              ) : (
                <p>No {listType} yet.</p>
              )}
            </ul>
            <CloseButton onClick={() => setShowModal(false)}>Close</CloseButton>
          </Modal>
        </>
      )}
    </ProfileContainer>
  );
};

export default UserProfile;
