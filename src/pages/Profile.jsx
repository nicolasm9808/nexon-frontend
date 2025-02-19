import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: ${({ theme }) => (theme.darkMode ? "#fff" : "#000")};
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
`;

const InfoText = styled.p`
  margin: 5px 0;
  font-weight: bold;
`;

const EditInput = styled.input`
  padding: 8px;
  margin: 5px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 15px;
  margin: 5px;
  background-color: ${({ $danger }) => ($danger ? "red" : "#4CAF50")};
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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    fullName: "",
    phoneNumber: "",
    bio: "",
    profilePicture: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [listType, setListType] = useState(""); // "followers" o "following"
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setUpdatedInfo({
          fullName: response.data.fullName,
          phoneNumber: response.data.phoneNumber,
          bio: response.data.bio,
          profilePicture: response.data.profilePicture,
        });
      } catch (err) {
        toast.error("Error fetching user data", { position: "top-center" });
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = async () => {
    try {
      const payload = {
        fullName: updatedInfo.fullName || "",
        phoneNumber: updatedInfo.phoneNumber || "",
        bio: updatedInfo.bio || "",
        profilePicture: updatedInfo.profilePicture || ""
      };
  
      console.log("Sending data:", payload); // Debugging
  
      const response = await axios.patch(
        `http://localhost:8081/api/users/${user?.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      toast.success("Profile updated successfully", { position: "top-center" });
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
      toast.error("Error updating profile", { position: "top-center" });
    }
  };
  

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account deleted successfully", { position: "top-center" });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      toast.error("Error deleting account", { position: "top-center" });
    }
  };

  const fetchFollowersOrFollowing = async (type) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/follow/${type}/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserList(response.data);
      setListType(type);
      setShowModal(true);
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
    }
  };

  if (!user) return <Container>Loading...</Container>;

  return (
    <Container>
      <h2>Profile</h2>
      <ProfileImage src={user.profilePicture || "/default-avatar.png"} alt="Profile" />
      
      {isEditing ? (
        <>
          <EditInput type="text" name="fullName" value={updatedInfo.fullName || ""} onChange={handleInputChange} />
          <EditInput type="text" name="phoneNumber" value={updatedInfo.phoneNumber || ""} onChange={handleInputChange} />
          <EditInput type="text" name="bio" value={updatedInfo.bio || ""} onChange={handleInputChange} />
          <EditInput type="text" name="profilePicture" value={updatedInfo.profilePicture || ""} onChange={handleInputChange} />
          <Button onClick={handleSave}>Save</Button>
        </>
      ) : (
        <>
          <InfoText><strong>Full Name:</strong> {user.fullName}</InfoText>
          <InfoText><strong>Phone:</strong> {user.phoneNumber}</InfoText>
          <InfoText><strong>Bio:</strong> {user.bio}</InfoText>
          <FollowInfo onClick={() => fetchFollowersOrFollowing("followers")}>
            Followers: {user.followersCount}
          </FollowInfo>
          <FollowInfo onClick={() => fetchFollowersOrFollowing("following")}>
            Following: {user.followingCount}
          </FollowInfo>
          <Button onClick={handleEdit}>Edit</Button>
        </>
      )}

      <Button $danger={true} onClick={handleDelete}>Delete Account</Button>

      {showModal && (
        <>
          <Overlay onClick={() => setShowModal(false)} />
          <Modal>
            <h3>{listType === "followers" ? "Followers" : "Following"}</h3>
            <ul>
              {userList.map((u) => (
                <li key={u.id}>{u.username}</li>
              ))}
            </ul>
            <CloseButton onClick={() => setShowModal(false)}>Close</CloseButton>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default Profile;
