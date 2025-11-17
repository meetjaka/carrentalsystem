import mongoose from "mongoose";
import Review from "../models/Review.js";

const PROFANITY_LIST = ["badword", "nonsense"];

const containsProfanity = (text) => {
  if (!text) return false;
  const lower = text.toLowerCase();
  return PROFANITY_LIST.some((word) => lower.includes(word));
};

export const getReviews = async (req, res) => {
  try {
    const {
      carId,
      sort = "recent",
      rating,
      verified,
      page = 1,
      limit = 9,
    } = req.query;

    const query = { status: "approved" };

    if (carId && mongoose.Types.ObjectId.isValid(carId)) {
      query.carId = carId;
    }

    if (rating) {
      const minRating = Number(rating);
      if (minRating === 5) {
        query.rating = 5;
      } else if (minRating >= 1 && minRating <= 5) {
        query.rating = { $gte: minRating };
      }
    }

    if (verified === "1") {
      query.verified = true;
    }

    const sortMap = {
      recent: { createdAt: -1 },
      helpful: { helpfulCount: -1 },
      rating: { rating: -1 },
    };

    const sortOption = sortMap[sort] || sortMap.recent;

    const numericLimit = Math.min(Number(limit) || 9, 50);
    const numericPage = Math.max(Number(page) || 1, 1);

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .sort(sortOption)
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit)
        .select("-helpfulBy -reports"),
      Review.countDocuments(query),
    ]);

    return res.json({
      success: true,
      reviews,
      total,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.ceil(total / numericLimit),
    });
  } catch (error) {
    console.error("getReviews error:", error);
    return res.status(500).json({ success: false, message: "Failed to load reviews" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { name, email, location, rating, title, comment, image, carId } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    if (!location || location.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Location is required" });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Comment must be at least 10 characters" });
    }

    if (containsProfanity(comment) || containsProfanity(title)) {
      return res.status(400).json({ success: false, message: "Please remove inappropriate language" });
    }

    const reviewData = {
      name: name.trim(),
      email: email?.trim() || null,
      location: location.trim(),
      rating: numericRating,
      title: title?.trim() || null,
      comment: comment.trim(),
      image: image || null,
      verified: false,
    };

    if (carId && mongoose.Types.ObjectId.isValid(carId)) {
      reviewData.carId = carId;
    }

    const review = await Review.create(reviewData);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review,
    });
  } catch (error) {
    console.error("createReview error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit review" });
  }
};

export const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid review id" });
    }

    const sessionId = req.headers["x-session-id"] || req.ip;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.helpfulBy.includes(sessionId)) {
      return res.status(400).json({ success: false, message: "You have already marked this review as helpful" });
    }

    review.helpfulBy.push(sessionId);
    review.helpfulCount += 1;
    await review.save();

    return res.json({ success: true, message: "Marked as helpful", helpfulCount: review.helpfulCount });
  } catch (error) {
    console.error("markHelpful error:", error);
    return res.status(500).json({ success: false, message: "Failed to mark helpful" });
  }
};

export const reportReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid review id" });
    }

    if (!category || !message || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Category and detailed message are required" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    review.reports.push({
      category,
      message: message.trim(),
      reportedBy: req.headers["x-session-id"] || req.ip,
    });

    if (review.reports.length >= 3) {
      review.status = "flagged";
    }

    await review.save();

    return res.json({ success: true, message: "Report submitted. Thank you for your feedback." });
  } catch (error) {
    console.error("reportReview error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit report" });
  }
};

export const getReviewStats = async (req, res) => {
  try {
    const { carId } = req.query;
    const match = { status: "approved" };

    if (carId && mongoose.Types.ObjectId.isValid(carId)) {
      match.carId = new mongoose.Types.ObjectId(carId);
    }

    const stats = await Review.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
          total: { $sum: "$rating" },
        },
      },
    ]);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalReviews = 0;
    let totalScore = 0;

    stats.forEach((stat) => {
      distribution[stat._id] = stat.count;
      totalReviews += stat.count;
      totalScore += stat._id * stat.count;
    });

    const averageRating = totalReviews ? totalScore / totalReviews : 0;

    return res.json({
      success: true,
      stats: {
        averageRating,
        totalReviews,
        distributionCounts: distribution,
      },
    });
  } catch (error) {
    console.error("getReviewStats error:", error);
    return res.status(500).json({ success: false, message: "Failed to load stats" });
  }
};

