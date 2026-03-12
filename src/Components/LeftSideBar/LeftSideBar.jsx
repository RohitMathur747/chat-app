import React from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { logout } from "../../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";
import { arrayUnion } from "firebase/firestore";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userData, chatData } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("name", "==", input.toLowerCase()));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty && querySnapshot.docs[0].id !== userData.uid) {
          let userExists = false;
          chatData.map((user) => {
            if (user.rId === querySnapshot.docs[0].data().id) {
              userExists = true;
            }
          });
          if (!userExists) {
            setUser(querySnapshot.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // const handleEditProfile = () => {
  //   navigate("/profile");
  // };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatsRef, userData.uid), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const setChat = async (item) => {
    console.log(item);
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
            <img src={user.avatar} alt="friends" className="icon" />
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
