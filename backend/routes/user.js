import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/user/profile - current user
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/user/profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatar, lastSeen } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar, lastSeen: lastSeen || Date.now() },
      { new: true },
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/:id - specific user
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: "User not found" });
    // Remove password
    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
