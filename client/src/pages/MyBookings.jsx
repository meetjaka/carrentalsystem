import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const MyBookings = () => {
  const { axios, user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/booking/user");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (user) fetchMyBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage your all car bookings"
        align="left"
      />

      <div>
        {bookings.map((booking, index) => (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6  border    border-borderColor rounded-lg mt-5 first:mt-12"
          >
            {/* Car image + info  */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                <img
                  src={booking.car.image}
                  alt="Car"
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              <p className="text-lg font-medium mt-2">
                {booking.car.brand} {booking.car.model}
              </p>
              <p className="text-gray-500">
                Year: {booking.car.year} <br />
                Category: {booking.car.category} <br />
                Location: {booking.car.location}
              </p>
            </div>
            {/* Booking info  */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-400/15 text-green-600"
                      : booking.status === "pending"
                      ? "bg-yellow-400/15 text-yellow-600"
                      : "bg-red-400/15 text-red-600"
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </p>
              </div>
              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.calendar_icon_colored}
                  className="w-4 h-4 mt-1"
                  alt="calendar"
                />
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p>
                    {booking.pickupDate.split("T")[0]} to{" "}
                    {booking.returnDate.split("T")[0]}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Days:{" "}
                    {Math.ceil(
                      (new Date(booking.returnDate) -
                        new Date(booking.pickupDate)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.location_icon_colored}
                  className="w-4 h-4 mt-1"
                  alt="location"
                />
                <div>
                  <p className="text-gray-500">Pick-up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.user_profile}
                  className="w-4 h-4 mt-1"
                  alt="owner"
                />
                <div>
                  <p className="text-gray-500">Car Owner</p>
                  <p>{booking.car.ownerName || "N/A"}</p>
                </div>
              </div>
            </div>
            {/* Price and trip details  */}
            <div className="md:col-span-1 flex flex-col justify-between gap-6">
              <div className="text-sm text-gray-500 text-right">
                <p>Price Breakdown</p>
                <p>
                  {currency} {booking.car.pricePerDay} x{" "}
                  {Math.ceil(
                    (new Date(booking.returnDate) -
                      new Date(booking.pickupDate)) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </p>
                <h1 className="text-2xl font-semibold text-primary mt-1">
                  {currency} {booking.price}
                </h1>
                <p>Booked on {booking.createdAt.split("T")[0]}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyBookings;
