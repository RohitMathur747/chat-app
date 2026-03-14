import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api, { authAPI, userAPI, chatAPI } from "../config/api";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(
    async (userId) => {
      const currentUserId = userId || localStorage.getItem("userId");
      if (!currentUserId) {
        localStorage.clear();
        navigate("/");
        return;
      }
      try {
        const response = await userAPI.getUserById(currentUserId);
        const user = response.data;
        console.log("User loaded:", user);
        localStorage.setItem("userId", user.id);
        setUserData(user);

        if (user.avatar && user.name) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }

        // Update lastSeen interval
        const interval = setInterval(async () => {
          try {
            await userAPI.updateUser({ lastSeen: Date.now() });
          } catch (err) {
            console.error("Last seen update failed:", err);
          }
        }, 60000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.clear();
        navigate("/");
      }
    },
    [navigate],
  );

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (userData) {
      // Load chats
      const fetchChats = async () => {
        try {
          const response = await chatAPI.getChats(userData.id);
          const chats = response.data;
          // Assume backend returns chats with user data populated
          setChatData(
            chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
          );
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      };
      fetchChats();

      // Socket connection
      const newSocket = io("http://localhost:5000");
      newSocket.emit("add-user", userData.id);
      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
    socket,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
