import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getChatMessages,
  sendMessage,
  getUserChats,
  markAsRead,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get("/messages/:userId/:ownerId", protect, getChatMessages);
chatRouter.post("/send", protect, sendMessage);
chatRouter.get("/user/:userId", protect, getUserChats);
chatRouter.post("/mark-read", protect, markAsRead);

export default chatRouter;
