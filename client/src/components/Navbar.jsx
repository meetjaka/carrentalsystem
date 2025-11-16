import React, { useState, useEffect } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const Navbar = ({}) => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } =
    useAppContext();

  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 1g:px-24 xl:px-32
         py-4 text-[#8DA0BF] border-b border-[rgba(255,255,255,0.04)] transition-all backdrop-blur-md ${
           scrolled 
             ? "bg-[#0A0F14]/95 shadow-[0_8px_24px_rgba(0,0,0,0.4)]" 
             : "bg-transparent"
         }`}
    >
      <Link to="/" className="flex items-center gap-2">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="NextDrive"
          className="h-10 md:h-12"
        />
        <span className="text-xl md:text-2xl font-semibold text-[#DCE7F5] hidden sm:block">NextDrive</span>
      </Link>
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:bordert border-[rgba(255,255,255,0.04)] right-0 flex flex-col
       sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 bg-[#0A0F14] backdrop-blur-sm
       ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"} `}
      >
        {menuLinks.map((link, index) => (
          <Link 
            key={index} 
            to={link.path} 
            onClick={() => setOpen(false)}
            className={`hover:text-[#DCE7F5] transition-colors ${
              location.pathname === link.path ? "text-[#0A4D9F]" : "text-[#8DA0BF]"
            }`}
          >
            {link.name}
          </Link>
        ))}

        <div className="hidden lg:flex items-center text-sm gap-2 border border-[rgba(255,255,255,0.04)] bg-[#121A22] px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-[#8DA0BF] text-[#DCE7F5] focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] rounded-full"
            placeholder="Search Products"
          />
          <img src={assets.search_icon} alt="search" className="brightness-0 invert opacity-60" />
        </div>
        <div className=" flex max-sm:flex-col items-start sm:items-center gap-6">
          <button
            onClick={() => (isOwner ? navigate("/owner") : changeRole())}
            className="cursor-pointer text-[#8DA0BF] hover:text-[#0A4D9F] transition-colors"
          >
            {isOwner ? "  Dashboard" : "List Cars"}
          </button>
          {user ? (
            <div className="relative">
              {user.image ? (
                <img
                  src={`${user.image}?${Date.now()}`}
                  alt="profile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#0A4D9F] object-cover"
                  onClick={() => setOpen((prev) => !prev)}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#0A4D9F] bg-[#121A22] flex items-center justify-center text-[#0A4D9F] font-semibold text-lg"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-[#121A22] border border-[rgba(255,255,255,0.04)] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-[#0C2A44] text-[#DCE7F5] transition-colors"
                    onClick={() => {
                      navigate(isOwner ? "/owner" : "/my-bookings");
                      setOpen(false);
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-[#0C2A44] text-[#DCE7F5] transition-colors"
                    onClick={() => {
                      navigate("/chats");
                      setOpen(false);
                    }}
                  >
                    Messages
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-[#0C2A44] text-[#EF4444] transition-colors"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="cursor-pointer px-8 py-2 bg-[#0A4D9F] hover:bg-[#083A78] transition-all text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        {" "}
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className="brightness-0 invert opacity-60" />
      </button>
    </motion.div>
  );
};

export default Navbar;
