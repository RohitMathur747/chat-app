import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import "../../index.css";
import assets from "../../assets/assets";
import { AppContext } from "../../Context/AppContext";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages } =
    useContext(AppContext);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input.trim() && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);
          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId,
            );
            userChatData.chatsData[chatIndex].lastMessage = input;
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
    setInput("");
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
      });
      return () => {
        unSub();
      };
    }
  }, [messagesId]);

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
            const time = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Pending";
            return (
              <div key={idx} className={isSender ? "s-msg" : "r-msg"}>
                {!isSender && (
                  <img
                    src={chatUser.userData.avatar}
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
            value={input}
            placeholder="Type your message here..."
          />
          <input type="file" id="img" accept="image/png,image/jpeg" hidden />
          <label htmlFor="img">
            <img src={assets.gallery_icon} alt="attach" />
          </label>
          <img onClick={sendMessage} src={assets.send_button} alt="" />
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
