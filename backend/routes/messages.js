import express from "express";
import Message from "../models/Message.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET /api/messages/:chatId
router.get("/:chatId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.findOne({ _id: req.params.chatId });
    if (!messages) return res.json({ messages: [] });
    res.json(messages.messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/messages/:chatId/send
router.post("/:chatId/send", authMiddleware, async (req, res) => {
  try {
    const { text, image } = req.body;
    const messageData = {
      sId: req.user.id,
      createdAt: Date.now(),
      ...(text && { text }),
      ...(image && { image }),
    };

    await Message.findByIdAndUpdate(req.params.chatId, {
      $push: { messages: messageData },
    });

    // Emit via socket (will be handled in server.js)
    req.io.to(req.params.chatId).emit("receive-message", messageData);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
