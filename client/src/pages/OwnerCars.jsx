import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";

const OwnerCars = () => {
  const { ownerId } = useParams();
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { axios } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/owner/owner-details/${ownerId}`);
        console.log("API response for owner details:", data);
        if (data.success) {
          setOwnerData(data.data);
        } else {
          setOwnerData(null);
        }
      } catch (err) {
        console.error("Error fetching owner details:", err);
        setOwnerData(null);
      }
      setLoading(false);
    };
    fetchOwnerDetails();
  }, [ownerId, axios]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <Loader />;
  }

  if (!ownerData) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 bg-[#0A0F14] min-h-screen">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-[#8DA0BF] mb-4">Owner Not Found</h1>
          <p className="text-[#8DA0BF]">The owner you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const { owner, statistics, cars, recentBookings } = ownerData;

  return (
    <div className="min-h-screen bg-[#0A0F14]">
      {/* Owner Profile Header */}
      <div className="bg-[#121A22] border-b border-[rgba(255,255,255,0.04)]">
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-0 pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Owner Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-[#0C2A44] border-4 border-[#121A22] shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center justify-center text-[#DCE7F5] text-2xl font-semibold">
                  {owner.image ? (
                    <img 
                      src={owner.image} 
                      alt={owner.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    owner.name.charAt(0).toUpperCase()
                  )}
                </div>
                {/* Verification Badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#16A34A] rounded-full flex items-center justify-center border-2 border-[#121A22] shadow-md">
                  <img src={assets.check_icon} alt="Verified" className="w-3 h-3 brightness-0 invert" />
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-[#0A4D9F]">{owner.name}</h1>
                <span className="px-3 py-1 bg-[#16A34A] text-white text-sm font-medium rounded-full">
                  Verified Owner
                </span>
              </div>
              <p className="text-[#8DA0BF] mb-4 text-lg">
                Member since {formatDate(owner.memberSince)}
              </p>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-6 text-[#8DA0BF]">
                <div className="flex items-center gap-2">
                  <img src={assets.location_icon} alt="Location" className="w-4 h-4 brightness-0 invert opacity-60" />
                  <span className="text-sm">Contact via platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={assets.star_icon} alt="Rating" className="w-4 h-4 brightness-0 invert opacity-60" />
                  <span className="text-sm">{statistics.averageRating}/5.0 rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#121A22] rounded-lg p-6 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8DA0BF] mb-1">Total Cars</p>
                <p className="text-2xl font-bold text-[#0A4D9F]">{statistics.totalCars}</p>
                <p className="text-xs text-[#8DA0BF] mt-1">in collection</p>
              </div>
              <div className="w-10 h-10 bg-[#0A4D9F]/10 rounded-lg flex items-center justify-center">
                <img src={assets.car_icon} alt="Cars" className="w-5 h-5 brightness-0 invert opacity-60" />
              </div>
            </div>
          </div>

          <div className="bg-[#121A22] rounded-lg p-6 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8DA0BF] mb-1">Available</p>
                <p className="text-2xl font-bold text-[#0A4D9F]">{statistics.availableCars}</p>
                <p className="text-xs text-[#8DA0BF] mt-1">ready to rent</p>
              </div>
              <div className="w-10 h-10 bg-[#16A34A]/10 rounded-lg flex items-center justify-center">
                <img src={assets.check_icon} alt="Available" className="w-5 h-5 brightness-0 invert opacity-60" />
              </div>
            </div>
          </div>

          <div className="bg-[#121A22] rounded-lg p-6 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8DA0BF] mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-[#0A4D9F]">{statistics.totalBookings}</p>
                <p className="text-xs text-[#8DA0BF] mt-1">all time</p>
              </div>
              <div className="w-10 h-10 bg-[#0A4D9F]/10 rounded-lg flex items-center justify-center">
                <img src={assets.calendar_icon_colored} alt="Bookings" className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-[#121A22] rounded-lg p-6 shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8DA0BF] mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-[#0A4D9F]">{formatCurrency(statistics.totalRevenue)}</p>
                <p className="text-xs text-[#8DA0BF] mt-1">earned</p>
              </div>
              <div className="w-10 h-10 bg-[#0A4D9F]/10 rounded-lg flex items-center justify-center">
                <span className="text-[#0A4D9F] font-bold text-lg">₹</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cars Section */}
        <div className="bg-[#121A22] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.03)]">
          <div className="p-6 border-b border-[rgba(255,255,255,0.04)]">
            <h2 className="text-2xl font-bold text-[#0A4D9F] mb-2">Available Cars</h2>
            <p className="text-[#8DA0BF]">Explore {owner.name}'s car collection</p>
          </div>

          {cars.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <div
                    key={car._id}
                    className="bg-[#0C2A44] rounded-lg border border-[rgba(255,255,255,0.03)] overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.7)] transition-shadow duration-200 cursor-pointer group"
                    onClick={() => navigate(`/car-details/${car._id}`)}
                  >
                    <div className="relative">
                      <img
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 brightness-[0.94] contrast-[1.02]"
                      />
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${
                        car.isAvaliable 
                          ? 'bg-[#16A34A] text-white' 
                          : 'bg-[#EF4444] text-white'
                      }`}>
                        {car.isAvaliable ? 'Available' : 'Unavailable'}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-[#0A4D9F] mb-1">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-[#8DA0BF] text-sm mb-3">
                        {car.category} • {car.year}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-[#8DA0BF] mb-4">
                        <div className="flex items-center gap-1">
                          <img src={assets.users_icon} alt="Seats" className="w-4 h-4 brightness-0 invert opacity-60" />
                          <span>{car.seating_capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <img src={assets.fuel_icon} alt="Fuel" className="w-4 h-4 brightness-0 invert opacity-60" />
                          <span>{car.fuel_type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <img src={assets.car_icon} alt="Transmission" className="w-4 h-4 brightness-0 invert opacity-60" />
                          <span>{car.transmission}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.04)]">
                        <div className="flex items-center gap-1">
                          <img src={assets.location_icon} alt="Location" className="w-4 h-4 brightness-0 invert opacity-60" />
                          <span className="text-sm text-[#8DA0BF]">{car.location}</span>
                        </div>
                        <p className="text-lg font-bold text-[#0A4D9F]">
                          ₹{car.pricePerDay}/day
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[#0C2A44] rounded-full flex items-center justify-center mx-auto mb-4">
                <img src={assets.car_icon} alt="No cars" className="w-8 h-8 brightness-0 invert opacity-60" />
              </div>
              <h3 className="text-lg font-medium text-[#DCE7F5] mb-2">No Cars Available</h3>
              <p className="text-[#8DA0BF]">This owner hasn't added any cars yet.</p>
            </div>
          )}
        </div>

        {/* Recent Bookings Section */}
        {recentBookings.length > 0 && (
          <div className="bg-[#121A22] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.03)] mt-8">
            <div className="p-6 border-b border-[rgba(255,255,255,0.04)]">
              <h2 className="text-2xl font-bold text-[#0A4D9F] mb-2">Recent Bookings</h2>
              <p className="text-[#8DA0BF]">Latest bookings for {owner.name}'s cars</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center gap-4 p-4 bg-[#0C2A44] rounded-lg hover:bg-[#0F161C] transition-colors duration-200">
                    <img 
                      src={booking.car.image} 
                      alt={booking.car.brand}
                      className="w-12 h-12 rounded-lg object-cover brightness-[0.94] contrast-[1.02]"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#DCE7F5]">
                        {booking.car.brand} {booking.car.model}
                      </h4>
                      <p className="text-sm text-[#8DA0BF]">
                        Booked by {booking.user.name}
                      </p>
                      <p className="text-xs text-[#8DA0BF]">
                        {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#0A4D9F]">{formatCurrency(booking.price)}</p>
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-[#16A34A] text-white'
                          : booking.status === 'pending'
                          ? 'bg-[#EF4444] text-white'
                          : 'bg-[#EF4444] text-white'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerCars;
