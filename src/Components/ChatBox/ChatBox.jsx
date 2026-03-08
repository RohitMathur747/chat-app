import React from "react";
import "./ChatBox.css";
import "../../index.css";
import assets from "../../assets/assets";
const ChatBox = () => {
  return (
    <>
      <div className="chat-box">
        <div className="chat-user">
          <img src={assets.profile_img} alt="profile" className="icon" />
          <p>Richard Sanford</p>
          <img src={assets.green_dot} alt="green dot" className="dot" />
          <img src={assets.help_icon} alt="help" className="help-icon" />
        </div>

        <div className="chat-msg">
          <div className="s-msg">
            <p className="msg">
              Lorem ipsum placeholder text commonly used in the graphic, print,
              and ...
            </p>
            <img src={assets.profile_img} alt="profile" className="icon" />
            <p>2:30 PM</p>
          </div>

          <div className="s-msg">
            <img src={assets.pic1} className="msg-image" alt="" />
            <img src={assets.profile_img} alt="profile" className="icon" />
            <p>2:30 PM</p>
          </div>

          <div className="r-msg">
            <img src={assets.profile_img} alt="profile" className="icon" />
            <p className="msg">
              Lorem ipsum placeholder text commonly used in the graphic, print,
              and publishing industries for previewing layouts and visual
              mockups.
            </p>
            <p>2:30 PM</p>
          </div>
        </div>

        <div className="chat-input">
          <input type="text" placeholder="Type your message here..." />
          <input type="file" id="img" accept="image/png,image/jpeg" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="attach" />
          </label>
          <img src={assets.send_button} alt="" />
        </div>
      </div>
    </>
  );
};

export default ChatBox;
