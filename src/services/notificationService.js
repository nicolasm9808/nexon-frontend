import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const socketUrl = "http://localhost:8081/ws"; // Ajusta según tu backend

let stompClient = null;

export const connectToNotifications = (userId, callback) => {
  if (!userId) return; // Evita conexión si no hay usuario

  const socket = new SockJS(socketUrl);
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("Connected to WebSocket");
      stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
        callback(JSON.parse(message.body));
      });
    },
    onDisconnect: () => console.log("Disconnected from WebSocket"),
  });

  stompClient.activate();
};

export const disconnectFromNotifications = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};
