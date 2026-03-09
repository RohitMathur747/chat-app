// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2XCBIEo1ndjdCqYQfSUL4pmQbmsJr5Js",
  authDomain: "chat-app-gs-434f4.firebaseapp.com",
  projectId: "chat-app-gs-434f4",
  storageBucket: "chat-app-gs-434f4.firebasestorage.app",
  messagingSenderId: "432363953911",
  appId: "1:432363953911:web:777eb6f12bfa2410267df2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey , There i am using chat app",
      lastseen: Date.now(),
    });

    await setDoc(doc(db, "chats", user.uid), {
      chatData: [],
    });

    toast.success("Account created successfully!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" ").toUpperCase());
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Login successful!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" ").toUpperCase());
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    toast.success("Logout successful!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" ").toUpperCase());
  }
};

export { signup, login, logout, auth, db };
