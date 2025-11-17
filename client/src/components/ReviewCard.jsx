import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import StarRating from "./StarRating";
import { assets } from "../assets/assets";

const ReviewCard = ({ review, onHelpful, onReport, isExpanded: externalExpanded, onToggleExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [isHelpful, setIsHelpful] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const expanded = externalExpanded !== undefined ? externalExpanded : isExpanded;
  const toggleExpanded = onToggleExpand || (() => setIsExpanded(!isExpanded));

  const handleHelpful = (e) => {
    e.stopPropagation();
    if (!isHelpful) {
      setHelpfulCount(helpfulCount + 1);
      setIsHelpful(true);
      onHelpful?.(review._id);
    }
  };

  const handleReport = (e) => {
    e.stopPropagation();
    setShowReportModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="group bg-[#111721] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.55)] p-6 border border-[rgba(255,255,255,0.04)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.65)] transition-all duration-300 cursor-pointer"
        onClick={toggleExpanded}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-[#DCE7F5]">{review.name}</h3>
              {review.verified && (
                <span className="px-2 py-0.5 bg-[#0A4D9F] text-white text-xs rounded-md font-medium">
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-[#8DA0BF]">{review.location}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#8DA0BF] mb-2">{formatDate(review.createdAt)}</p>
            <StarRating rating={review.rating} size="sm" />
          </div>
        </div>

        {/* Title */}
        {review.title && (
          <h4 className="text-base font-semibold text-[#DCE7F5] mb-2">{review.title}</h4>
        )}

        {/* Comment */}
        <p className="text-[#8DA0BF] text-sm leading-relaxed mb-4">
          {expanded ? review.comment : truncateText(review.comment)}
        </p>

        {/* Image */}
        {review.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={review.image}
              alt="Review"
              className="w-full h-48 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.04)]">
          <button
            onClick={handleHelpful}
            disabled={isHelpful}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] ${
              isHelpful
                ? "bg-[#0A4D9F] text-white"
                : "bg-[#0A0F14] text-[#8DA0BF] hover:bg-[#151D27]"
            }`}
            aria-label={`Mark as helpful. ${helpfulCount} people found this helpful`}
          >
            <span>Helpful</span>
            {helpfulCount > 0 && <span className="text-xs">({helpfulCount})</span>}
          </button>
          <button
            onClick={handleReport}
            className="px-3 py-1.5 text-sm text-[#8DA0BF] hover:text-[#DCE7F5] hover:bg-[#151D27] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
            aria-label="Report this review"
          >
            Report
          </button>
        </div>
      </motion.div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <ReportModal
            reviewId={review._id}
            onClose={() => setShowReportModal(false)}
            onReport={onReport}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const ReportModal = ({ reviewId, onClose, onReport }) => {
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const reportCategories = [
    "Spam",
    "Inappropriate content",
    "False information",
    "Harassment",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category && message) {
      onReport?.(reviewId, { category, message });
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111721] rounded-2xl border border-[rgba(255,255,255,0.04)] shadow-[0_14px_40px_rgba(0,0,0,0.55)] max-w-md w-full p-6"
      >
        <h3 className="text-xl font-bold text-[#DCE7F5] mb-4">Report Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8DA0BF] mb-2">
              Reason
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
              required
            >
              <option value="">Select a reason</option>
              {reportCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0F161C]">
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8DA0BF] mb-2">
              Additional details
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] resize-none"
              placeholder="Please provide more details..."
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-[#8DA0BF] hover:text-[#DCE7F5] hover:bg-[#151D27] rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
            >
              Submit Report
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ReviewCard;

