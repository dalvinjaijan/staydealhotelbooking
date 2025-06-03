import mongoose, { Schema, model } from "mongoose";
import { IChat } from "../../Adapters/interfaces/chatInterface/IChatSchema";

const chatSchema = new Schema<IChat>(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hosts",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    latestMessage: {
      type: mongoose.Types.ObjectId,
      ref: "messages",
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = model("Chat", chatSchema);

export default chatModel;
