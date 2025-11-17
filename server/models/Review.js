import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    message: { type: String, required: true },
    reportedBy: { type: String, default: null },
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    comment: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    verified: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    helpfulBy: [{ type: String }], // store hashed ip/session identifiers
    reports: [reportSchema],
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", default: null },
    status: { type: String, enum: ["approved", "pending", "flagged", "rejected"], default: "approved" },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;

