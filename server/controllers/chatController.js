import Message from "../models/Message.js";
import User from "../models/User.js";

// Get chat messages between two users
export const getChatMessages = async (req, res) => {
  try {
    const { userId, ownerId } = req.params;
    const chatId = [userId, ownerId].sort().join("_");

    const messages = await Message.find({ chatId })
      .populate("sender", "name image")
      .populate("receiver", "name image")
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const chatId = [senderId, receiverId].sort().join("_");

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      chatId,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name image")
      .populate("receiver", "name image");

    res.json({ success: true, message: populatedMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get all chats for a user
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all unique chat partners
    const sentMessages = await Message.find({ sender: userId }).distinct(
      "receiver"
    );
    const receivedMessages = await Message.find({ receiver: userId }).distinct(
      "sender"
    );

    const chatPartners = [...new Set([...sentMessages, ...receivedMessages])];

    // Get latest message for each chat
    const chats = await Promise.all(
      chatPartners.map(async (partnerId) => {
        const chatId = [userId, partnerId].sort().join("_");
        const latestMessage = await Message.findOne({ chatId })
          .populate("sender", "name image")
          .populate("receiver", "name image")
          .sort({ createdAt: -1 });

        const partner = await User.findById(partnerId).select("name image");

        return {
          partnerId,
          partner,
          latestMessage,
          chatId,
        };
      })
    );

    res.json({ success: true, chats });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    await Message.updateMany(
      { chatId, receiver: userId, read: false },
      { read: true }
    );

    res.json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
