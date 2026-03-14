import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    messages: [
      {
        sId: { type: String, required: true },
        text: String,
        image: String,
        createdAt: { type: Number, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
