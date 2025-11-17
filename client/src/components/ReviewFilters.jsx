import React from "react";
import { motion, AnimatePresence } from "motion/react";

const ReviewFilters = ({ sort, onSortChange, ratingFilter, onRatingFilterChange, verifiedOnly, onVerifiedToggle }) => {
  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "helpful", label: "Most Helpful" },
    { value: "rating", label: "Highest Rating" },
  ];

  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5★" },
    { value: "4", label: "4★+" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Left: Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#8DA0BF]">Filter:</span>
          <div className="flex gap-2">
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onRatingFilterChange(option.value)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] ${
                  ratingFilter === option.value
                    ? "bg-[#0A4D9F] text-white"
                    : "bg-[#0A0F14] text-[#8DA0BF] border border-[rgba(255,255,255,0.04)] hover:bg-[#151D27]"
                }`}
                aria-pressed={ratingFilter === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verified Toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => onVerifiedToggle(e.target.checked)}
            className="w-4 h-4 rounded border-[rgba(255,255,255,0.04)] bg-[#0A0F14] text-[#0A4D9F] focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
          />
          <span className="text-sm text-[#8DA0BF]">Verified only</span>
        </label>
      </div>

      {/* Right: Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#8DA0BF]">Sort by:</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] text-sm hover:bg-[#151D27] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] transition-colors"
          aria-label="Sort reviews"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#0F161C]">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ReviewFilters;

