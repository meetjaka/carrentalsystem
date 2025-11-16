import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Footer = () => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="px=6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-[#8DA0BF] bg-[#0A0F14]"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-between gap-8 pb-6 border-[rgba(255,255,255,0.04)] border-b"
      >
        <div>
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            src={assets.logo}
            alt="logo"
            className="h-8 md:h-9"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-80 mt-3"
          >
            Premium car rental service with a wide selection of luxury and
            everday vehicles for all your driving needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3 mt-6"
          >
            <a href="">
              <img src={assets.facebook_logo} alt="" className="w-5 h-5" />
            </a>
            <a href="">
              <img src={assets.instagram_logo} alt="" className="w-5 h-5" />
            </a>
            <a href="">
              <img src={assets.twitter_logo} alt="" className="w-5 h-5" />
            </a>
            <a href="">
              <img src={assets.gmail_logo} alt="" className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-between w-1/2 gap-8"
        >
          <div>
            <h2 className="text-base font-medium text-[#DCE7F5]">
              Quick Links
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm">
              <li>
                <a href="#" className="hover:text-[#0A4D9F] transition-colors">Home</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0A4D9F] transition-colors">Browse Cars</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0A4D9F] transition-colors">List Your Cars</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0A4D9F] transition-colors">About Us</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-medium text-[#DCE7F5]">Resources</h2>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm">
              <li>
                <a href="#" className="hover:text-[#0A4D9F] transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0A4D9F] transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0A4D9F] transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0A4D9F] transition-colors">Insurance</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-medium text-[#DCE7F5]">Contact</h2>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm">
              <li>1234 Rental Car Office</li>
              <li>San Francisco , CA 94107</li>
              <li>+91 9876543210</li>
              <li>carrental@gmail.com</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col md:flex-row gap-2 items-center justify-between py-5"
      >
        <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>|</li>
          <li>
            <a href="#">Sitemap</a>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Footer;
