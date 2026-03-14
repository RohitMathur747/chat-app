import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatData: [
      {
        messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        rId: { type: String, required: true },
        lastMessage: String,
        updatedAt: { type: Number, default: Date.now },
        messageSeen: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Chat", chatSchema);
