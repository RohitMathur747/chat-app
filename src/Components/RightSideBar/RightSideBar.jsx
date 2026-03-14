import React from "react";
import "./RightSideBar.css";
import assets from "../../assets/assets";
import { authAPI } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RightSideBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div className="rs">
        <div className="rs-profile">
          <img src={assets.profile_img} alt="profile" />
          <h3>
            Richard Sanford
            <img src={assets.green_dot} alt="online" />
          </h3>

          <p>Hey, there i am Richard Sanford using chat App</p>
        </div>
        <hr />
        <div className="rs-media">
          <p>Media</p>
          <div>
            <img src={assets.pic1} alt="" />
            <img src={assets.pic2} alt="" />
            <img src={assets.pic3} alt="" />
            <img src={assets.pic4} alt="" />
            <img src={assets.pic1} alt="" />
            <img src={assets.pic2} alt="" />
          </div>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default RightSideBar;
