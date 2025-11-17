import express from "express";
import {
  getReviews,
  createReview,
  markHelpful,
  reportReview,
  getReviewStats,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/", createReview);
router.post("/:id/helpful", markHelpful);
router.post("/:id/report", reportReview);
router.get("/stats", getReviewStats);

export default router;

