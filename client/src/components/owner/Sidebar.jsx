import React, { useState } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [image, setImage] = useState("");

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axios.post("/api/owner/update-image", formData);

      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage("");
      }
    } catch (error) {
      toast.success(error.message);
    }
  };

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
      <div className="group relative">
        <label htmlFor="image">
          {image ? (
            <img
              className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto object-cover"
              src={URL.createObjectURL(image)}
              alt=""
            />
          ) : user?.image ? (
            <img
              className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto object-cover"
              src={user.image}
              alt=""
            />
          ) : (
            <div className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto bg-[#121A22] flex items-center justify-center text-[#0A4D9F] font-semibold text-lg md:text-2xl">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <img src={assets.edit_icon} alt="" />
          </div>
        </label>
      </div>
      {image && (
        <button
          className="absolute top-0 right-0 flex gap-1 p-2 bg-primary/10 text-primary cursor-pointer"
          onClick={updateImage}
        >
          Save <img src={assets.check_icon} width={13} alt="" />
        </button>
      )}
      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname
                ? "bg-primary/10 text-primary"
                : "text-gray-600"
            }`}
          >
            <img
              src={
                link.path === location.pathname ? link.coloredIcon : link.icon
              }
              alt="car icon"
            />
            <span className="max-md:hidden">{link.name}</span>
            <div
              className={`${
                link.path === location.pathname && "bg-primary"
              } w-1.5 h-8 rounded-l right-0 absolute  `}
            ></div>
          </NavLink>
        ))}
        {/* Logout button just below menu links */}
        <button
          className="ml-7 mt-8 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg w-44"
          onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) {
              window.localStorage.removeItem("token");
              navigate("/");
              window.location.reload();
            }
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
