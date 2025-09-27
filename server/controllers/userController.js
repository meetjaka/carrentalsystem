// Confirm Email
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const pendingUser = await PendingUser.findOne({ token });
    if (!pendingUser) {
      return res.json({ success: false, message: "Invalid or expired token." });
    }
    const { name, email, password } = pendingUser;
    const userExists = await User.findOne({ email });
    if (userExists) {
      await PendingUser.deleteOne({ token });
      return res.json({ success: false, message: "User already exists." });
    }
    const user = await User.create({ name, email, password, confirmed: true });
    await PendingUser.deleteOne({ token });
    res.json({
      success: true,
      message: "Email confirmed. You can now log in.",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
import User from "../models/User.js";
import Car from "../models/Car.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import PendingUser from "../models/PendingUser.js";
import { sendConfirmationEmail } from "../configs/mailer.js";

//generate jwt token

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: "Fill All the Fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }
    const pendingExists = await PendingUser.findOne({ email });
    if (pendingExists) {
      return res.json({
        success: false,
        message: "Confirmation already sent. Check your email.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");
    await PendingUser.create({ name, email, password: hashedPassword, token });
    await sendConfirmationEmail(email, token);
    res.json({
      success: true,
      message: "Confirmation email sent. Please check your inbox.",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Login User

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Get User data using Token
export const getUserData = async (req, res) => {
  try {
    const { user } = req;

    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//  get all cars for frontend

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvaliable: true });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get user by ID (for chat feature)
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("name image role");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
