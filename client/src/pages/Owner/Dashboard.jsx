import React, { useEffect, useState } from "react";
import { assets, dummyDashboardData } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 9,
  });

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
    },
    {
      title: "Pendings",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Confirmed",
      value: data.completedBookings,
      icon: assets.listIconColored,
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/owner/dashboard");
      if (data.success) {
        setData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
useEffect(() => {
  fetchDashboardData();
}, []);


  return (
    <div className="px-4 pt-10 md:px-10 flex-1 bg-[#0A0F14] min-h-screen">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-[rgba(255,255,255,0.04)] bg-[#121A22]"
          >
            <div>
              <h1 className="text-xs text-[#8DA0BF]">{card.title}</h1>
              <p className="text-lg font-semibold text-[#0A4D9F]">{card.value}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0A4D9F]/10">
              <img src={card.icon} alt="" className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        {/* recent booking  */}
        <div className="p-4 md:p-6 border border-[rgba(255,255,255,0.04)] bg-[#121A22] rounded-md max-w-lg w-full">
          <h1 className="text-lg font-medium text-[#DCE7F5]">Recent Bookings</h1>
          <p className="text-[#8DA0BF]">Latest customer bookings</p>
          {data.recentBookings.map((booking, index) => (
            <div key={index} className="flex mt-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[#0A4D9F]/10">
                  <img
                    src={assets.listIconColored}
                    className="h-5 w-5"
                    alt=""
                  />
                </div>
                <div>
                  <p className="text-[#DCE7F5]">
                    {booking.car.brand} {booking.car.model}
                  </p>
                  <p className="text-sm text-[#8DA0BF]">
                    {booking.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <p className="text-sm text-[#8DA0BF]">
                  {currency}
                  {booking.price}
                </p>
                <p className="px-3 py-0.5 border border-[rgba(255,255,255,0.04)] rounded-full text-sm text-[#8DA0BF]">
                  {booking.status}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* montly revenue  */}
        <div className="p-4 md:p-6 mb-6 border border-[rgba(255,255,255,0.04)] bg-[#121A22] rounded-md w-full md:max-w-xs">
          <h1 className="text-lg font-medium text-[#DCE7F5]">Monthly Revenue</h1>
          <p className="text-[#8DA0BF]">Revenue for current month</p>
          <p className="text-[#0A4D9F] font-semibold text-3xl mt-6">
            {currency}
            {data.monthlyRevenue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
