import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import mongoose from "mongoose";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const idObj = new mongoose.Types.ObjectId();
    const id = idObj.toHexString();

    const hashedPw = await bcrypt.hash(password, 10);
    const user = new User({
      _id: idObj,
      id,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPw,
    });

    await user.save();

    // Create chats doc
    const chat = new Chat({ userId: user._id, chatData: [] });
    await chat.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user.id,
        username,
        email,
        name: "",
        avatar: "",
        bio: user.bio,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update lastSeen
    user.lastSeen = Date.now();
    await user.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
