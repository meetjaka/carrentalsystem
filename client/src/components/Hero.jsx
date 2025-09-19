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
      className="h-screen flex flex-col items-center justify-center gap-14 bg-light text-center"
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold"
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
    bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]
  "
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8">
          <div className="flex flex-col items-start gap-2">
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            >
              <option value="">PickUp Location</option>
              {dynamicCityList.length > 0 ? (
                dynamicCityList.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))
              ) : (
                <option disabled>No cities available</option>
              )}
            </select>
            <p className="px-1 text-sm text-gray-500">
              {pickupLocation ? pickupLocation : "Please select location"}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date"> Pick-up Date</label>
            <input
              type="date"
              id="pickup-date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="text-sm text-gray-500"
              required
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="return-date"> Return Date</label>
            <input
              type="date"
              id="return-date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="text-sm text-gray-500"
              required
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer"
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
        className="max-h-74"
      />
    </motion.div>
  );
};

export default Hero;
