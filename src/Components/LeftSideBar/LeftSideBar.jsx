import React from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { logout } from "../../config/firebase";

const LeftSideBar = () => {
  const navigate = useNavigate();

  const inputHandler = async (e) => {
    try {
    } catch (error) {}
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
        {Array(12)
          .fill("")
          .map((item, index) => (
            <div className="friends" key={index}>
              <img src={assets.profile_img} alt="friends" className="icon" />
              <div>
                <p>Richard Sanford</p>
                <span>Hello How are You?</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LeftSideBar;
