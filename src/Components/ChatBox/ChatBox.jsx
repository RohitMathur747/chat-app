import React, { useContext, useEffect, useState, useCallback } from "react";
import "./ChatBox.css";
import "../../index.css";
import assets from "../../assets/assets";
import { AppContext } from "../../Context/AppContext";
import { messageAPI } from "../../config/api";
import { toast } from "react-toastify";
import uploadFile from "../../lib/upload";

const ChatBox = () => {
  const {
    userData,
    messagesId: chatId,
    chatUser,
    messages,
    setMessages,
    socket,
  } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sending, setSending] = useState(false);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (chatId) {
      try {
        const response = await messageAPI.getMessages(chatId);
        setMessages(response.data.reverse());
      } catch (error) {
        console.error("Load messages error:", error);
      }
    }
  }, [chatId, setMessages]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Socket realtime
  useEffect(() => {
    if (socket && chatId) {
      socket.emit("join-chat", chatId);
      const handleReceiveMessage = (data) => {
        setMessages((prev) => [data, ...prev]);
      };
      socket.on("receive-message", handleReceiveMessage);
      return () => {
        socket.off("receive-message", handleReceiveMessage);
      };
    }
  }, [socket, chatId, setMessages]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)");
      return;
    }
    setSelectedFile(file);
  };

  const sendMessage = async () => {
    if (sending || !chatId) return;
    setSending(true);

    try {
      let text = input.trim();
      let image = null;

      if (selectedFile) {
        image = await uploadFile(selectedFile);
      }

      await messageAPI.sendMessage({ chatId, text, image });
      // Backend handles DB + socket emit

      setInput("");
      setSelectedFile(null);
      document.getElementById("img").value = "";
    } catch (error) {
      toast.error("Send failed");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return chatUser ? (
    <>
      <div className="chat-box">
        <div className="chat-user">
          <img src={chatUser.userData.avatar} alt="profile" className="icon" />
          <p>{chatUser.userData.name}</p>
          <img src={assets.green_dot} alt="green dot" className="dot" />
          <img src={assets.help_icon} alt="help" className="help-icon" />
        </div>

        <div className="chat-msg">
          {messages.map((msg, idx) => {
            const isSender = msg.sId === userData.id;
            const time = formatTime(msg.createdAt);
            return (
              <div key={idx} className={isSender ? "s-msg" : "r-msg"}>
                {!isSender && (
                  <img
                    src={
                      msg.sId === userData.id
                        ? userData.avatar
                        : chatUser.userData.avatar
                    }
                    alt="profile"
                    className="icon"
                  />
                )}
                {msg.image ? (
                  <img src={msg.image} className="msg-image" alt="" />
                ) : (
                  <p className="msg">{msg.text}</p>
                )}
                {isSender && (
                  <img src={userData.avatar} alt="profile" className="icon" />
                )}
                <p>{time}</p>
              </div>
            );
          })}
        </div>

        <div className="chat-input">
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            value={input}
            placeholder="Type your message here..."
          />
          {selectedFile && (
            <div className="file-preview">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <span>{selectedFile.name}</span>
            </div>
          )}
          <input
            type="file"
            id="img"
            accept="image/png,image/jpeg"
            hidden
            onChange={handleFileSelect}
          />
          <label htmlFor="img">
            <img src={assets.gallery_icon} alt="attach" />
          </label>
          <img
            onClick={sendMessage}
            src={assets.send_button}
            alt="send"
            style={{
              opacity: sending ? 0.5 : 1,
              cursor: sending ? "not-allowed" : "pointer",
            }}
          />
        </div>
      </div>
    </>
  ) : (
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="" />
      <p>chat anytime,anywhere</p>
    </div>
  );
};

export default ChatBox;
