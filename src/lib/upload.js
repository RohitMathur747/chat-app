import api from "../config/api.js";
import { toast } from "react-toastify";

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.image;
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Failed to upload file");
    throw error;
  }
};

export default uploadFile;
