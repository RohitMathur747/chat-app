import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    avatar: String,
    bio: String,
    lastSeen: {
      type: Number,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
