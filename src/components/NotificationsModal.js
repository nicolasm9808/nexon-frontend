import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { connectToNotifications, disconnectFromNotifications } from "../services/notificationService";

const ModalContainer = styled.div`
  position: fixed;
  top: 50px;
  right: 20px;
  width: 300px;
  background: ${({ theme }) => (theme.darkMode ? "#222" : "#fff")};
  color: ${({ theme }) => (theme.darkMode ? "#fff" : "#000")};
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 15px;
  display: ${({ $show }) => ($show ? "block" : "none")};
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: ${({ theme }) => (theme.darkMode ? "#333" : "#f5f5f5")};
  }
`;

const MarkAsReadButton = styled.button`
  background: ${({ theme }) => (theme.darkMode ? "#444" : "#ddd")};
  border: none;
  color: ${({ theme }) => (theme.darkMode ? "#fff" : "#000")};
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: ${({ theme }) => (theme.darkMode ? "#555" : "#ccc")};
  }
`;

const NotificationsModal = ({ show, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/notifications/unread", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); 
    connectToNotifications(userId, (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => disconnectFromNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:8081/api/notifications/${id}/read`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Actualiza el estado para ocultar la notificación marcada como leída
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  return (
    <ModalContainer $show={show}>
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        notifications.map((notif) => (
          <NotificationItem key={notif.id}>
            <span>{notif.message}</span>
            <MarkAsReadButton onClick={() => markAsRead(notif.id)}>
              Marcar como leído
            </MarkAsReadButton>
          </NotificationItem>
        ))
      )}
    </ModalContainer>
  );
};

export default NotificationsModal;
