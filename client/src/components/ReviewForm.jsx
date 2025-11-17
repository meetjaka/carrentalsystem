import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import StarRating from "./StarRating";
import { assets } from "../assets/assets";

const ReviewForm = ({ onClose, onSubmit, carId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    rating: 0,
    title: "",
    comment: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image must be less than 5MB" }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.rating === 0) newErrors.rating = "Please select a rating";
    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, carId });
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || "Failed to submit review" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Write a review"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#111721] rounded-2xl border border-[rgba(255,255,255,0.04)] shadow-[0_14px_40px_rgba(0,0,0,0.55)] max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#DCE7F5]">Write a Review</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#151D27] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                aria-label="Close review form"
              >
                <img
                  src={assets.close_icon}
                  alt=""
                  className="w-5 h-5 brightness-0 invert opacity-60"
                />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="review-name" className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-4 py-2.5 bg-[#0A0F14] border ${
                    errors.name
                      ? "border-red-500"
                      : "border-[rgba(255,255,255,0.04)]"
                  } rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]`}
                  placeholder="Your name"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="review-email" className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Email (optional, for verification)
                </label>
                <input
                  id="review-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="review-location" className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  id="review-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className={`w-full px-4 py-2.5 bg-[#0A0F14] border ${
                    errors.location
                      ? "border-red-500"
                      : "border-[rgba(255,255,255,0.04)]"
                  } rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]`}
                  placeholder="City, State"
                  required
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-400">{errors.location}</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={(rating) => handleChange("rating", rating)}
                    interactive={true}
                    size="lg"
                  />
                  {formData.rating > 0 && (
                    <span className="text-sm text-[#8DA0BF]">
                      {formData.rating} out of 5
                    </span>
                  )}
                </div>
                {errors.rating && (
                  <p className="mt-1 text-xs text-red-400">{errors.rating}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label htmlFor="review-title" className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Title (optional)
                </label>
                <input
                  id="review-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                  placeholder="Brief summary of your experience"
                />
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="review-comment" className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Review <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="review-comment"
                  value={formData.comment}
                  onChange={(e) => handleChange("comment", e.target.value)}
                  rows={5}
                  className={`w-full px-4 py-2.5 bg-[#0A0F14] border ${
                    errors.comment
                      ? "border-red-500"
                      : "border-[rgba(255,255,255,0.04)]"
                  } rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] resize-none`}
                  placeholder="Share your experience (minimum 10 characters)"
                  required
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.comment && (
                    <p className="text-xs text-red-400">{errors.comment}</p>
                  )}
                  <p className="text-xs text-[#8DA0BF] ml-auto">
                    {formData.comment.length} / 10 minimum
                  </p>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="review-image" className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Image (optional)
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="review-image"
                    className="px-4 py-2.5 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] cursor-pointer hover:bg-[#151D27] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                  >
                    Choose Image
                  </label>
                  <input
                    id="review-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {formData.image && (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleChange("image", null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="mt-1 text-xs text-red-400">{errors.image}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                  <p className="text-sm text-red-400">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
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
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewForm;

