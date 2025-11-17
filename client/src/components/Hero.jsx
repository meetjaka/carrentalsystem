import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import HeroCarCard from "./HeroCarCard";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState();
  const [selectedCategory, setSelectedCategory] = useState("SUV");
  const {
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    navigate,
    cars,
    currency,
  } = useAppContext();

  // Get unique cities from cars
  const dynamicCityList = Array.from(
    new Set(cars.map((car) => car.location).filter(Boolean))
  );

  // Category list
  const categories = ["SUV", "Sedan", "Luxury", "Sports"];

  // Filter cars by selected category
  const filteredCars = cars.filter((car) => {
    const carCategory = car.category?.toLowerCase();
    const selected = selectedCategory.toLowerCase();
    
    // Map categories for better matching
    if (selected === "luxury") {
      return carCategory === "luxury" || car.brand?.toLowerCase().includes("bmw") || 
             car.brand?.toLowerCase().includes("mercedes") || car.brand?.toLowerCase().includes("audi");
    }
    if (selected === "sports") {
      return carCategory === "sports" || carCategory === "sport";
    }
    return carCategory === selected;
  });

  // Get first 3 cars for hero section
  const featuredCars = filteredCars.slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = new URLSearchParams({
      pickupLocation,
      pickupDate,
      returnDate,
    }).toString();

    navigate(`/cars?${query}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center gap-12 py-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-[#0A0F14]"
    >
      {/* Hero Title */}
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#DCE7F5] text-center"
      >
        Luxury cars on Rent
      </motion.h1>

      {/* Search Bar */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-5xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-[#111721] border border-[rgba(255,255,255,0.04)] shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1 w-full">
          {/* Pickup Location */}
          <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
            <label htmlFor="pickup-location" className="text-xs sm:text-sm text-[#8DA0BF] font-medium uppercase tracking-wide">
              Pickup Location
            </label>
            <select
              id="pickup-location"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full bg-transparent text-base text-[#DCE7F5] outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] rounded-lg py-1"
            >
              <option value="" className="bg-[#0F161C]">Select Location</option>
              {dynamicCityList.length > 0 ? (
                dynamicCityList.map((city) => (
                  <option key={city} value={city} className="bg-[#0F161C]">
                    {city}
                  </option>
                ))
              ) : (
                <option disabled className="bg-[#0F161C]">No cities available</option>
              )}
            </select>
          </div>

          {/* Pick-up Date */}
          <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
            <label htmlFor="pickup-date" className="text-xs sm:text-sm text-[#8DA0BF] font-medium uppercase tracking-wide">
              Pick-up Date
            </label>
            <input
              type="date"
              id="pickup-date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full text-base text-[#DCE7F5] bg-transparent border-none outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] rounded-lg py-1 [color-scheme:dark]"
              required
            />
          </div>

          {/* Return Date */}
          <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
            <label htmlFor="return-date" className="text-xs sm:text-sm text-[#8DA0BF] font-medium uppercase tracking-wide">
              Return Date
            </label>
            <input
              type="date"
              id="return-date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split("T")[0]}
              className="w-full text-base text-[#DCE7F5] bg-transparent border-none outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] rounded-lg py-1 [color-scheme:dark]"
              required
            />
          </div>
        </div>

        {/* Search Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-2xl font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:ring-offset-2 focus:ring-offset-[#111721] transition-colors whitespace-nowrap w-full sm:w-auto"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="brightness-300 w-5 h-5"
          />
          Search
        </motion.button>
      </motion.form>

      {/* Category Filters */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm md:text-base transition-all duration-300 ${
              selectedCategory === category
                ? "bg-[#111721] text-[#DCE7F5] border border-[rgba(255,255,255,0.08)]"
                : "bg-transparent text-[#8DA0BF] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] hover:text-[#DCE7F5]"
            }`}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Car Cards */}
      {featuredCars.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {featuredCars.map((car, index) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            >
              <HeroCarCard car={car} currency={currency} />
            </motion.div>
          ))}
        </motion.div>
      )}
      {featuredCars.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-[#8DA0BF] text-center"
        >
          No cars available in this category
        </motion.p>
      )}
    </motion.div>
  );
};

export default Hero;
