import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai, Maharashtra",
      testimonial:
        "NextDrive se car rent karne ka experience bahut accha raha. Service bahut professional thi aur car bilkul saaf-safai se mili. Next time bhi yahi se book karunga!",
    },
    {
      name: "Priya Sharma",
      location: "Delhi, NCR",
      testimonial:
        "Maine NextDrive se car book kiya tha Goa trip ke liye. Car delivery time par mili aur customer support team ne har query ka jawaab diya. Highly recommend karta hoon!",
    },
    {
      name: "Amit Patel",
      location: "Bangalore, Karnataka",
      testimonial:
        "NextDrive ki service bahut reliable hai. Car condition excellent thi aur pricing bhi competitive hai. Family trip ke liye perfect option hai. Dhanyawad NextDrive team!",
    },
  ];
  return (
    <div className="py-28 px-8 md:py-16 lg:px-24 xl:px-44 bg-[#0A0F14]">
      <Title
        title="What Our Customers Say"
        subTitle="Discover why thousands of Indian travelers trust NextDrive for their car rental needs across India."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            key={index}
            className="bg-[#121A22] border border-[rgba(255,255,255,0.03)] p-6 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] max-w-xs hover:translate-y-1 transition-all duration-500"
          >
            <div className="mb-3">
              <p className="text-lg font-semibold text-[#DCE7F5]">{testimonial.name}</p>
              <p className="text-sm text-[#8DA0BF]">{testimonial.location}</p>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <img key={index} src={assets.star_icon} alt="star_icon" className="brightness-0 invert opacity-60" />
                ))}
            </div>
            <p className="text-[#8DA0BF] max-w-90 mt-4 font-light">
              "{testimonial.testimonial}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
