import React, { useEffect, useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Chat from "./Pages/Chat/Chat";
import Profile from "./Pages/ProfileUpdate/ProfileUpdate";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { AppContext } from "./Context/AppContext";

const App = () => {
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, load user data and navigate based on profile completion
        // console.log("User is signed in:", user);
        await loadUserData(user.uid);
      } else {
        // User is signed out, navigate to login page
        navigate("/");
        console.log("User is signed out");
      }
    });
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
