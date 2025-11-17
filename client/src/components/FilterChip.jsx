import React from "react";
import { motion } from "motion/react";
import { assets } from "../assets/assets";

const FilterChip = ({ label, value, onRemove, ariaLabel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111721] border border-[rgba(255,255,255,0.04)] rounded-xl text-sm text-[#DCE7F5]"
      role="status"
      aria-label={ariaLabel || `Active filter: ${label}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#151D27] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
          aria-label={`Remove filter: ${label}`}
        >
          <img
            src={assets.close_icon}
            alt=""
            className="w-3 h-3 brightness-0 invert opacity-60"
          />
        </button>
      )}
    </motion.div>
  );
};

export default FilterChip;

