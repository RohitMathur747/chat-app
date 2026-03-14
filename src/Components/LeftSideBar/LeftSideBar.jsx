import React, { useState, useContext } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../config/api";
import { chatAPI } from "../../config/api";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userData, chatData, setChatUser, setMessagesId } =
    useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const inputHandler = async (e) => {
    const input = e.target.value;
    setSearchQuery(input);
    if (input) {
      try {
        setShowSearch(true);
        const response = await chatAPI.search(input.toLowerCase());
        const searchedUser = response.data;
        if (searchedUser && searchedUser.id !== userData.id) {
          // Check if already in chats
          const userExists = chatData?.some((c) => c.rId === searchedUser.id);
          if (!userExists) {
            setUser(searchedUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Search error:", error);
        setUser(null);
      }
    } else {
      setShowSearch(false);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      toast.success("Logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.clear();
    navigate("/");
  };

  const addChat = async () => {
    try {
      const response = await chatAPI.add({ rId: user.id });
      const { messageId } = response.data;
      // Refresh chats in context or refetch
      toast.success("Chat started!");
      setShowSearch(false);
      setUser(null);
      // Context will refetch or socket update
    } catch (error) {
      toast.error("Failed to start chat");
      console.error(error);
    }
  };

  const setChat = (item) => {
    setMessagesId(item.messageId);
    setChatUser(item);
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="logo" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="menu" className="menu-icon" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="search" className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={inputHandler}
            placeholder="Search Here.."
            className="search-input"
          />
        </div>
      </div>
      <div className="ls-list">
        {!chatData ? (
          <div className="loading">Loading chats...</div>
        ) : showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img
              src={user.avatar || assets.avatar_icon}
              alt="friends"
              className="icon"
            />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData.map((item, index) => (
            <div onClick={() => setChat(item)} className="friends" key={index}>
              <img src={item.userData.avatar} alt="friends" className="icon" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
