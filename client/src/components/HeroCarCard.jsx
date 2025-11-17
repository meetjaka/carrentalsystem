import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const HeroCarCard = ({ car, currency }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/car-details/${car._id}`);
    scrollTo(0, 0);
  };

  return (
    <motion.div
      className="group relative bg-[#111721] rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.55)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.65)] transition-all duration-300 cursor-pointer border border-[rgba(255,255,255,0.04)] hover:bg-[#151D27]"
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.94] contrast-[1.02]"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
        />
      </div>

      {/* INFO SECTION */}
      <div className="p-6">
        <div className="mb-4">
          <motion.h3
            className="text-xl font-bold text-[#DCE7F5] mb-2"
            whileHover={{ color: "#0A4D9F" }}
            transition={{ duration: 0.3 }}
          >
            {car.brand} {car.model}
          </motion.h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#DCE7F5]">
              {currency}
              {car.pricePerDay}
            </span>
            <span className="text-sm text-[#8DA0BF] ml-1">/day</span>
          </div>
        </div>

        {/* VIEW DETAILS BUTTON */}
        <motion.button
          className="w-full px-4 py-3 border border-[rgba(255,255,255,0.04)] text-[#8DA0BF] rounded-xl font-medium hover:bg-[#151D27] hover:text-[#DCE7F5] hover:border-[rgba(255,255,255,0.08)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HeroCarCard;

