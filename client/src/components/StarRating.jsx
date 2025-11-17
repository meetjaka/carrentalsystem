import React from "react";
import { motion } from "motion/react";
import { assets } from "../assets/assets";

const StarRating = ({ rating, onRatingChange, interactive = false, size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1" role={interactive ? "radiogroup" : "img"} aria-label={interactive ? "Rating" : `Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={!interactive}
          className={interactive ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] rounded" : "cursor-default"}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          aria-pressed={interactive ? star === rating : undefined}
        >
          <img
            src={assets.star_icon}
            alt=""
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "brightness-0 invert sepia-[100%] saturate-[10000%] hue-rotate-[200deg]"
                : "brightness-0 invert opacity-30"
            } transition-opacity`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;

