import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
  {
    sender: { type: ObjectId, ref: "User", required: true },
    receiver: { type: ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    chatId: { type: String, required: true }, // combination of user and owner IDs
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
