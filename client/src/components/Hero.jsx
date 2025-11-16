import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState();
  const {
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    navigate,
    cars,
  } = useAppContext();

  // Get unique cities from cars
  const dynamicCityList = Array.from(
    new Set(cars.map((car) => car.location).filter(Boolean))
  );

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
      className="h-screen flex flex-col items-center justify-center gap-14 bg-[#0A0F14] text-center"
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold text-[#DCE7F5]"
      >
        Luxury cars on Rent
      </motion.h1>
      <motion.form
        onSubmit={handleSearch}
        className="
    flex flex-col gap-4
    md:flex-row md:gap-10
    items-start md:items-center
    justify-between
    p-4 md:p-6
    rounded-xl md:rounded-full
    w-[90%] max-w-lg md:max-w-4xl
    bg-[#121A22] border border-[rgba(255,255,255,0.04)] shadow-[0_8px_24px_rgba(0,0,0,0.6)]
  "
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8">
          <div className="flex flex-col items-start gap-2">
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="bg-transparent text-[#DCE7F5] outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] rounded-lg"
            >
              <option value="" className="bg-[#0F161C]">PickUp Location</option>
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
            <p className="px-1 text-sm text-[#8DA0BF]">
              {pickupLocation ? pickupLocation : "Please select location"}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date" className="text-[#8DA0BF]"> Pick-up Date</label>
            <input
              type="date"
              id="pickup-date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="text-sm text-[#DCE7F5] bg-transparent border-none outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] rounded-lg"
              required
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="return-date" className="text-[#8DA0BF]"> Return Date</label>
            <input
              type="date"
              id="return-date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="text-sm text-[#DCE7F5] bg-transparent border-none outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] rounded-lg"
              required
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:ring-offset-2 focus:ring-offset-[#0A0F14] transition-colors"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="brightness-300"
          />
          Search
        </motion.button>
      </motion.form>
      <motion.img
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        src={assets.main_car}
        alt="Car"
        className="max-h-74 brightness-[0.94] contrast-[1.02]"
      />
    </motion.div>
  );
};

export default Hero;
