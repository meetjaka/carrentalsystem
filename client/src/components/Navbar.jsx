import React, { useState } from "react";
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
  const navigate = useNavigate();

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
         py-4 text-gray-600 border-b border-borderColor transition-all ${
           location.pathname == "/" ? "bg-light" : "bg-white"
         }`}
    >
      <Link to="/">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt=""
          className="h-8"
        />
      </Link>
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:bordert border-borderColor right-0 flex flex-col
       sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
         location.pathname == "/" ? "bg-light" : "bg-white"
       } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"} `}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} onClick={() => setOpen(false)}>
            {link.name}
          </Link>
        ))}

        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search Products"
          />
          <img src={assets.search_icon} alt="search" />
        </div>
        <div className=" flex max-sm:flex-col items-start sm:items-center gap-6">
          <button
            onClick={() => (isOwner ? navigate("/owner") : changeRole())}
            className="cursor-pointer"
          >
            {isOwner ? "  Dashboard" : "List Cars"}
          </button>
          {user ? (
            <div className="relative">
              <img
                src={
                  user.image
                    ? `${user.image}?${Date.now()}`
                    : assets.user_profile
                }
                alt="profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary"
                onClick={() => setOpen((prev) => !prev)}
              />
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigate(isOwner ? "/owner" : "/my-bookings");
                      setOpen(false);
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
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
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
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
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.div>
  );
};

export default Navbar;
