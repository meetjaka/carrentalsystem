import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const {
    user,
    setShowLogin,
    toggleFavorite,
    isFavorited: isCarFavorited,
  } = useAppContext();
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [quickBookDates, setQuickBookDates] = useState({
    pickupDate: "",
    returnDate: "",
  });

  const handleQuickBook = async (e) => {
    e.stopPropagation();
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (!quickBookDates.pickupDate || !quickBookDates.returnDate) {
      toast.error("Please select both pickup and return dates");
      return;
    }

    try {
      // Here you would implement the quick booking logic
      toast.success("Quick booking initiated! Redirecting to booking page...");
      navigate(`/car-details/${car._id}`, {
        state: {
          quickBook: true,
          dates: quickBookDates,
        },
      });
    } catch (error) {
      toast.error("Failed to initiate booking");
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (!user) {
      setShowLogin(true);
      return;
    }
    toggleFavorite(car._id);
    toast.success(
      isCarFavorited(car._id) ? "Removed from favorites" : "Added to favorites"
    );
  };

  const handleCardClick = () => {
    navigate(`/car-details/${car._id}`);
    scrollTo(0, 0);
  };

  return (
    <motion.div
      className="group relative bg-[#121A22] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-all duration-500 cursor-pointer border border-[rgba(255,255,255,0.03)]"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={car.image}
          alt="Car Image"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.94] contrast-[1.02]"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.7 }}
        />

        {/* AVAILABLE NOW TAG */}
        <motion.div
          className="absolute top-4 left-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {car.isAvaliable ? (
            <span className="bg-[#16A34A] text-white text-xs px-3 py-1.5 rounded-md font-medium shadow-lg">
              Available Now
            </span>
          ) : (
            <span className="bg-[#EF4444] text-white text-xs px-3 py-1.5 rounded-md font-medium shadow-lg">
              Unavailable
            </span>
          )}
        </motion.div>

        {/* FAVORITE BUTTON */}
        <motion.button
          className={`absolute top-4 right-4 bg-[#121A22]/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-[#121A22] transition-colors duration-300 ${
            isCarFavorited(car._id) ? "favorite-btn active" : "favorite-btn"
          }`}
          onClick={handleToggleFavorite}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.img
            src={assets.star_icon}
            alt="favorite"
            className={`h-5 w-5 ${isCarFavorited(car._id) ? 'brightness-0 invert sepia-[100%] saturate-[10000%] hue-rotate-[200deg]' : 'brightness-0 invert opacity-60'}`}
            animate={{
              scale: isCarFavorited(car._id) ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        {/* PRICE TAG */}
        <motion.div
          className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">
              {currency}
              {car.pricePerDay}
            </span>
            <span className="text-sm text-white/80 ml-1">/day</span>
          </div>
        </motion.div>

        {/* QUICK BOOK OVERLAY */}
        <AnimatePresence>
          {showQuickBook && (
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickBook(false);
              }}
            >
              <motion.div
                className="bg-[#121A22] border border-[rgba(255,255,255,0.04)] rounded-xl p-4 m-2 max-w-[280px] w-full shadow-[0_8px_24px_rgba(0,0,0,0.8)]"
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-[#DCE7F5]">Quick Book</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickBook(false);
                    }}
                    className="text-[#8DA0BF] hover:text-[#DCE7F5] transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-medium text-[#8DA0BF] mb-1">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={quickBookDates.pickupDate}
                      onChange={(e) =>
                        setQuickBookDates((prev) => ({
                          ...prev,
                          pickupDate: e.target.value,
                        }))
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-2.5 py-1.5 text-sm bg-[#0F161C] border border-[rgba(255,255,255,0.04)] text-[#DCE7F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8DA0BF] mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={quickBookDates.returnDate}
                      onChange={(e) =>
                        setQuickBookDates((prev) => ({
                          ...prev,
                          returnDate: e.target.value,
                        }))
                      }
                      min={quickBookDates.pickupDate || new Date().toISOString().split("T")[0]}
                      className="w-full px-2.5 py-1.5 text-sm bg-[#0F161C] border border-[rgba(255,255,255,0.04)] text-[#DCE7F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleQuickBook}
                      className="flex-1 bg-[#0A4D9F] text-white py-2 px-3 text-sm rounded-lg hover:bg-[#083A78] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] font-medium"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQuickBook(false);
                      }}
                      className="px-3 py-2 text-sm border border-[rgba(255,255,255,0.04)] text-[#8DA0BF] rounded-lg hover:bg-[#0C2A44] transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* INFO SECTION */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <motion.h3
              className="text-xl font-bold text-[#0A4D9F] mb-1"
              whileHover={{ color: "#083A78" }}
              transition={{ duration: 0.3 }}
            >
              {car.brand} {car.model}
            </motion.h3>
            <p className="text-[#8DA0BF] text-sm font-medium">
              {car.category} • {car.year}
            </p>
          </div>
        </div>

        {/* CAR SPECIFICATIONS */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            className="flex items-center text-sm text-[#8DA0BF] bg-[#0C2A44] rounded-lg p-2"
            whileHover={{ backgroundColor: "#0F161C" }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={assets.users_icon}
              alt=""
              className="h-4 mr-2 brightness-0 invert opacity-60"
            />
            <span className="font-medium">{car.seating_capacity} Seats</span>
          </motion.div>
          <motion.div
            className="flex items-center text-sm text-[#8DA0BF] bg-[#0C2A44] rounded-lg p-2"
            whileHover={{ backgroundColor: "#0F161C" }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={assets.fuel_icon}
              alt=""
              className="h-4 mr-2 brightness-0 invert opacity-60"
            />
            <span className="font-medium">{car.fuel_type}</span>
          </motion.div>
          <motion.div
            className="flex items-center text-sm text-[#8DA0BF] bg-[#0C2A44] rounded-lg p-2"
            whileHover={{ backgroundColor: "#0F161C" }}
            transition={{ duration: 0.3 }}
          >
            <img src={assets.car_icon} alt="" className="h-4 mr-2 brightness-0 invert opacity-60" />
            <span className="font-medium">{car.transmission}</span>
          </motion.div>
          <motion.div
            className="flex items-center text-sm text-[#8DA0BF] bg-[#0C2A44] rounded-lg p-2"
            whileHover={{ backgroundColor: "#0F161C" }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={assets.location_icon}
              alt=""
              className="h-4 mr-2 brightness-0 invert opacity-60"
            />
            <span className="font-medium truncate">{car.location}</span>
          </motion.div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <motion.button
            className="flex-1 bg-[#0A4D9F] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#083A78] transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:ring-offset-2 focus:ring-offset-[#121A22]"
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickBook(true);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Quick Book
          </motion.button>
          <motion.button
            className="px-4 py-3 border-2 border-[#0A4D9F] text-[#0A4D9F] rounded-xl font-semibold hover:bg-[#0A4D9F] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
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
      </div>
    </motion.div>
  );
};

export default CarCard;