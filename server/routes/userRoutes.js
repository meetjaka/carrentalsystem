import express from "express";
import {
  getCars,
  getUserData,
  loginUser,
  registerUser,
  confirmEmail,
  getUserById,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserData);
userRouter.get("/cars", getCars);
userRouter.get("/confirm/:token", confirmEmail);
userRouter.get("/user/:userId", getUserById);

export default userRouter;
