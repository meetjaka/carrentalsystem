import React from "react";
import { motion } from "motion/react";

const NewsLetter = () => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col items-center justify-center text-center space-y-2 max-md:px-4 my-10 mb-40 bg-[#0A0F14]"
    >
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="md:text-4xl text-2xl font-semibold text-[#0A4D9F]"
      >
        Never Miss a Deal!
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="md:text-lg text-[#8DA0BF] pb-8"
      >
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts
      </motion.p>
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
      >
        <input
          className="border border-[rgba(255,255,255,0.04)] bg-[#0F161C] rounded-xl h-full border-r-0 outline-none w-full rounded-r-none px-3 text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
          type="text"
          placeholder="Enter your email id"
          required
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-[#0A4D9F] hover:bg-[#083A78] transition-all cursor-pointer rounded-xl rounded-l-none focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
        >
          Subscribe
        </button>
      </motion.form>
    </motion.div>
  );
};

export default NewsLetter;
