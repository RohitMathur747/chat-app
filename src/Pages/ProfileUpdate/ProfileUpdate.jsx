import React, { useState, useEffect, useContext } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { userAPI } from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import uploadFile from "../../lib/upload";
import { AppContext } from "../../Context/AppContext";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData, setUserData } = useContext(AppContext);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!prevImage && !image) {
        toast.error("Upload a profile image");
        return;
      }
      const updateData = { name, bio };
      if (image) {
        updateData.avatar = await uploadFile(image);
        setPrevImage(updateData.avatar);
      }
      await userAPI.updateUser(updateData);
      toast.success("Profile updated successfully");
      if (userData) {
        setUserData({ ...userData, ...updateData });
      }
      navigate("/chat");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setBio(userData.bio || "");
      setPrevImage(userData.avatar || "");
    }
  }, [userData]);

  return (
    <>
      <div className="profile">
        <div className="profile-container">
          <form onSubmit={handleProfileUpdate}>
            <h3>Profile Details</h3>
            <label htmlFor="avatar">
              <input
                type="file"
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
            />
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
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
