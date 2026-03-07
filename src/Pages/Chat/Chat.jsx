import React from "react";
import "./Chat.css";
import LeftSidebar from "../../Components/LeftSideBar/LeftSideBar";
import ChatArea from "../../Components/ChatBox/ChatBox";
import RightSidebar from "../../Components/RightSidebar/RightSidebar";

const Chat = () => {
  return (
    <>
      <div className="chat">
        <div className="chat-container">
          <LeftSidebar />
          <ChatArea />
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Chat;
