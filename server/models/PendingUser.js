import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // expires in 1 hour
});

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;
