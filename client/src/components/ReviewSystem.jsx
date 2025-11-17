import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/AppContext";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import ReviewFilters from "./ReviewFilters";
import Title from "./Title";
import toast from "react-hot-toast";

const ReviewSystem = ({ carId = null }) => {
  const { axios } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Filter and sort state
  const [sort, setSort] = useState("recent");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 9;

  const fetchReviews = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: limit.toString(),
          sort,
          ...(ratingFilter !== "all" && { rating: ratingFilter }),
          ...(verifiedOnly && { verified: "1" }),
          ...(carId && { carId }),
        });

        const { data } = await axios.get(`/api/reviews?${params}`);

        if (data.success) {
          if (append) {
            setReviews((prev) => [...prev, ...data.reviews]);
          } else {
            setReviews(data.reviews);
          }
          setHasMore(data.reviews.length === limit);
          setPage(pageNum);
        } else {
          throw new Error(data.message || "Failed to load reviews");
        }
      } catch (err) {
        setError(err.message || "Failed to load reviews");
        toast.error(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [axios, sort, ratingFilter, verifiedOnly, carId, limit]
  );

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (carId) params.append("carId", carId);
      const { data } = await axios.get(`/api/reviews/stats?${params}`);
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }, [axios, carId]);

  // Initial load
  useEffect(() => {
    fetchReviews(1);
    fetchStats();
  }, [fetchReviews, fetchStats]);

  // Reload when filters change
  useEffect(() => {
    fetchReviews(1);
  }, [sort, ratingFilter, verifiedOnly]);

  // Handle submit review
  const handleSubmitReview = async (reviewData) => {
    try {
      const { data } = await axios.post("/api/reviews", reviewData);
      if (data.success) {
        toast.success("Review submitted successfully!");
        fetchReviews(1);
        fetchStats();
      } else {
        throw new Error(data.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to submit review");
      throw err;
    }
  };

  // Handle helpful
  const handleHelpful = async (reviewId) => {
    try {
      const { data } = await axios.post(`/api/reviews/${reviewId}/helpful`);
      if (data.success) {
        setReviews((prev) =>
          prev.map((review) =>
            review._id === reviewId
              ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
              : review
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to mark helpful");
    }
  };

  // Handle report
  const handleReport = async (reviewId, reportData) => {
    try {
      const { data } = await axios.post(`/api/reviews/${reviewId}/report`, reportData);
      if (data.success) {
        toast.success("Report submitted. Thank you for your feedback.");
      } else {
        throw new Error(data.message || "Failed to submit report");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to submit report");
    }
  };

  // Load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchReviews(page + 1, true);
    }
  };

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-32 bg-[#0A0F14]">
      <Title
        title="Customer Reviews"
        subTitle="Read what our customers have to say about their experience with NextDrive"
      />

      {/* Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-8 p-6 bg-[#111721] rounded-2xl border border-[rgba(255,255,255,0.04)]"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-[#0A4D9F]">{stats.averageRating?.toFixed(1) || "0.0"}</div>
            <div className="text-sm text-[#8DA0BF]">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#DCE7F5]">{stats.totalReviews || 0}</div>
            <div className="text-sm text-[#8DA0BF]">Total Reviews</div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <ReviewFilters
          sort={sort}
          onSortChange={setSort}
          ratingFilter={ratingFilter}
          onRatingFilterChange={setRatingFilter}
          verifiedOnly={verifiedOnly}
          onVerifiedToggle={setVerifiedOnly}
        />
        <button
          onClick={() => setShowReviewForm(true)}
          className="px-6 py-2.5 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] whitespace-nowrap"
          aria-label="Write a review"
        >
          Write a Review
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#111721] rounded-xl p-6 h-64 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-[#8DA0BF] mb-4">{error}</p>
          <button
            onClick={() => fetchReviews(1)}
            className="px-6 py-2.5 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && reviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <h3 className="text-2xl font-bold text-[#DCE7F5] mb-2">No reviews yet</h3>
          <p className="text-[#8DA0BF] mb-6">
            Be the first to share your experience!
          </p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-2.5 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
          >
            Write the First Review
          </button>
        </motion.div>
      )}

      {/* Reviews Grid */}
      {!loading && !error && reviews.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onHelpful={handleHelpful}
                onReport={handleReport}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 bg-[#111721] hover:bg-[#151D27] text-[#DCE7F5] rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? "Loading..." : "Load More Reviews"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleSubmitReview}
          carId={carId}
        />
      )}
    </div>
  );
};

export default ReviewSystem;

