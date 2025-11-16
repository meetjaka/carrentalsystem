import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { assets, dummyCarData } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const CarDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate } =
    useAppContext();
  const navigate = useNavigate();
  const [car, setCar] = useState();
  const currency = import.meta.env.VITE_CURRENCY;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/booking/create", {
        car: id,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setCar(cars.find((car) => car._id === id));

    // Handle quick booking from car card
    if (location.state?.quickBook && location.state?.dates) {
      const { pickupDate: quickPickup, returnDate: quickReturn } =
        location.state.dates;
      setPickupDate(quickPickup);
      setReturnDate(quickReturn);
      toast.success("Quick booking dates applied!");
    }
  }, [cars, id, location.state, setPickupDate, setReturnDate]);

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 bg-[#0A0F14] min-h-screen">
      <button
        className="flex items-center gap-2 mb-6 text-[#8DA0BF] hover:text-[#0A4D9F] cursor-pointer transition-colors"
        onClick={() => navigate(-1)}
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 brightness-0 invert opacity-60" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* left car img and details  */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <motion.img
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={car.image}
            alt=""
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-[0_8px_24px_rgba(0,0,0,0.6)] brightness-[0.94] contrast-[1.02]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-[#0A4D9F]">
                {car.brand} {car.model}
              </h1>
              <p className="text-[#8DA0BF] text-lg">
                {car.category} • {car.year}
              </p>
              {car.owner && (
                <div className="mt-2 flex items-center gap-4">
                  <p className="text-base text-[#DCE7F5]">
                    Owner:{" "}
                    <span
                      className="text-[#0A4D9F] font-semibold cursor-pointer hover:underline"
                      onClick={() => navigate(`/owner-cars/${car.owner}`)}
                    >
                      {car.ownerName || "View Owner"}
                    </span>
                  </p>
                  <button
                    onClick={() => navigate(`/chat/${car.owner}`)}
                    className="px-4 py-1.5 bg-[#16A34A] hover:bg-[#15803d] text-white text-sm rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(22,163,74,0.3)]"
                  >
                    Chat with Owner
                  </button>
                </div>
              )}
            </div>
            <hr className="border-[rgba(255,255,255,0.04)] my-6" />
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} Seats`,
                },
                { icon: assets.fuel_icon, text: `${car.fuel_type}` },
                { icon: assets.car_icon, text: `${car.transmission}` },
                { icon: assets.location_icon, text: `${car.location}` },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center bg-[#0C2A44] p-4 rounded-lg text-[#8DA0BF]"
                >
                  <img src={icon} alt="" className="h-5 mb-2 brightness-0 invert opacity-60" />
                  {text}
                </div>
              ))}
            </motion.div>
            {/* Description  */}
            <div>
              <h1 className="text-xl font-medium mb-3 text-[#DCE7F5]">Description</h1>
              <p className="text-[#8DA0BF]">{car.description}</p>
            </div>
            {/* Feature  */}
            <div>
              <h1 className="text-xl font-medium mb-3 text-[#DCE7F5]">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "360 Camera",
                  "Bluetooth",
                  "GPS",
                  "Heated Seats",
                  "Rear View Mirror",
                ].map((item) => (
                  <li key={item} className="flex items-center text-[#8DA0BF]">
                    <img src={assets.check_icon} alt="" className="h-4 mr-2 brightness-0 invert opacity-60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
        {/* right booking form  */}
        <motion.form
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#121A22] border border-[rgba(255,255,255,0.04)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] h-max sticky top-18 rounded-xl p-6 space-y-6 text-[#8DA0BF]"
          onSubmit={handleSubmit}
        >
          <p className="flex items-center justify-between text-2xl text-[#0A4D9F] font-semibold">
            {currency}
            {car.pricePerDay}{" "}
            <span className="text-base text-[#8DA0BF] font-normal">per day</span>
          </p>
          <hr className="border-[rgba(255,255,255,0.04)] my-6" />
          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date" className="text-[#8DA0BF]"> Pickup Date</label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              className="bg-[#0F161C] border border-[rgba(255,255,255,0.04)] text-[#DCE7F5] px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
              required
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="return-date" className="text-[#8DA0BF]"> Return Date</label>
            <input
              onChange={(e) => setReturnDate(e.target.value)}
              value={returnDate}
              type="date"
              className="bg-[#0F161C] border border-[rgba(255,255,255,0.04)] text-[#DCE7F5] px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)]"
              required
              id="return-date"
            />
          </div>
          <button className="w-full bg-[#0A4D9F] hover:bg-[#083A78] transition-all py-3 font-medium text-white rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:ring-offset-2 focus:ring-offset-[#121A22]">
            Book Now
          </button>

          <p className="text-center text-sm text-[#8DA0BF]">
            No credit card required to reserve
          </p>
        </motion.form>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default CarDetails;
