import React, { useState, useEffect } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, navigate to chat page
        console.log("User is signed in:", user);
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name) {
            setName(data.name);
          }
          if (data.bio) {
            setBio(data.bio);
          }
          if (data.avatar) {
            setImage(data.avatar);
          }
        }
      } else {
        // User is signed out, navigate to login page
        navigate("/");
        console.log("User is signed out");
      }
    });
  }, [navigate]);

  return (
    <>
      <div className="profile">
        <div className="profile-container">
          <form>
            <h3>Profile Details</h3>
            <label htmlFor="avatar">
              <input
                type="file"
                name=""
                onChange={(e) => setImage(e.target.files[0])}
                id="avatar"
                accept=".png,.jpg,.jpeg"
                hidden
              />
              <img
                src={image ? URL.createObjectURL(image) : assets.avatar_icon}
                alt=""
              />
              Upload Profile Image
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Your Name"
              required
            />
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              placeholder="write the profile bio"
              required
            ></textarea>
            <button type="submit">Save</button>
          </form>
          <img
            className="profile-pic"
            src={image ? URL.createObjectURL(image) : assets.logo_icon}
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;
