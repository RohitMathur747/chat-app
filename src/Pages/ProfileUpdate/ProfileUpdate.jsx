import React, { useState, useEffect, useContext } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { AppContext } from "../../Context/AppContext";

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  const ProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload a profile image");
        return;
      }
      const docRef = doc(db, "users", uid);
      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          name,
          bio,
          avatar: imgUrl,
        });
        toast.success("Profile updated successfully");
        navigate("/chat");
      } else {
        await updateDoc(docRef, {
          name,
          bio,
        });
        toast.success("Profile updated successfully");
        navigate("/chat");
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate("/chat");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user);
        setUid(user.uid);
        // Removed duplicate getDoc - AppContext handles loadUserData
        // Load local data only if exists (rules still needed)
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || "");
            setBio(data.bio || "");
            setPrevImage(data.avatar || "");
          }
        } catch (error) {
          console.error("Profile data load error (update rules):", error);
        }
      } else {
        navigate("/");
      }
    });
    return unsubscribe;
  }, [navigate]);

  return (
    <>
      <div className="profile">
        <div className="profile-container">
          <form onSubmit={ProfileUpdate}>
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
                src={
                  image
                    ? URL.createObjectURL(image)
                    : prevImage
                      ? prevImage
                      : assets.avatar_icon
                }
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
