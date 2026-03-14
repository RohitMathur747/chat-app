import jwt from "jsonwebtoken";
import User from "../models/User.js";

import mongoose from "mongoose";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ id: decoded.userId });
    if (!user) return res.status(401).json({ error: "Invalid token" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token expired/invalid" });
  }
};
