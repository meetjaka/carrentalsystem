import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Banner = () => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row md:items-start items-center justify-between px-8  min-md:pl-14 pt-10
    bg-[#121A22] border border-[rgba(255,255,255,0.04)] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
    >
      <div>
        <h2 className="text-3xl font-medium text-[#DCE7F5]">Do you Own a luxury Car?</h2>
        <p className="mt-2 text-[#8DA0BF]">
          Monetize your vehicle effortlessly by listing it on NextDrive
        </p>
        <p className="max-w-130 text-[#8DA0BF]">
          We take care of insurance, driver verfication and secure payments - so
          you can earn passive income , strees-free
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-[#0A4D9F] hover:bg-[#083A78] transition-all text-white rounded-xl text-sm mt-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
        >
          List your car
        </motion.button>
      </div>

      <motion.img
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        src={assets.banner_car_image}
        alt="car"
        className="max-h-45 mt-10 "
      />
    </motion.div>
  );
};

export default Banner;
