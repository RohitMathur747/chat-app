import express from "express";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/chats/:userId
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.findOne({ userId: req.user._id });
    if (!chats) return res.json({ chatData: [] });

    const chatData = await Promise.all(
      chats.chatData.map(async (item) => {
        const recipient = await User.findOne({ id: item.rId });
        return { ...item.toObject(), userData: recipient };
      }),
    );
    res.json(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chats/search?q=name
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      name: { $regex: q, $options: "i" },
      id: { $ne: req.user.id },
    }).limit(1);
    res.json(users[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chats/add
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { rId } = req.body;
    const messageId = new mongoose.Types.ObjectId();

    const message = new Message({
      _id: messageId,
      messages: [],
    });
    await message.save();

    // Update both users' chats
    await Chat.findOneAndUpdate(
      { userId: req.user._id },
      { $push: { chatData: { messageId, rId, updatedAt: Date.now() } } },
    );

    await Chat.findOneAndUpdate(
      { userId: (await User.findOne({ id: rId }))._id },
      {
        $push: {
          chatData: { messageId, rId: req.user.id, updatedAt: Date.now() },
        },
      },
    );

    res.json({ messageId: messageId.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
