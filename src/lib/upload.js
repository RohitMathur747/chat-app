import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "react-toastify";

const uploadFile = async (file) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const storageRef = ref(storage, `images/${fileName}`);

    // Set custom metadata for the upload
    const metadata = {
      contentType: file.type || "image/jpeg",
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading file:", error);

          // If CORS error, try alternative upload method
          if (
            error.code === "storage/cors-unsupported" ||
            error.message?.includes("CORS")
          ) {
            reject(
              new Error(
                "CORS error: Please configure CORS in Google Cloud Console. See: https://console.cloud.google.com/storage/browser/chat-app-gs-434f4.firebasestorage.app/permissions",
              ),
            );
          }
          toast.error("Error uploading file.");
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  });
};

export default uploadFile;
