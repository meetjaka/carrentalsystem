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
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Owner Not Found</h1>
          <p className="text-gray-500">The owner you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const { owner, statistics, cars, recentBookings } = ownerData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Owner Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-0 pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Owner Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center text-gray-700 text-2xl font-semibold">
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
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <img src={assets.check_icon} alt="Verified" className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{owner.name}</h1>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Verified Owner
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-lg">
                Member since {formatDate(owner.memberSince)}
              </p>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <img src={assets.location_icon} alt="Location" className="w-4 h-4" />
                  <span className="text-sm">Contact via platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={assets.star_icon} alt="Rating" className="w-4 h-4" />
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
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Cars</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalCars}</p>
                <p className="text-xs text-gray-500 mt-1">in collection</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <img src={assets.car_icon} alt="Cars" className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Available</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.availableCars}</p>
                <p className="text-xs text-gray-500 mt-1">ready to rent</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <img src={assets.check_icon} alt="Available" className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalBookings}</p>
                <p className="text-xs text-gray-500 mt-1">all time</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <img src={assets.calendar_icon_colored} alt="Bookings" className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(statistics.totalRevenue)}</p>
                <p className="text-xs text-gray-500 mt-1">earned</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-lg">₹</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cars Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Cars</h2>
            <p className="text-gray-600">Explore {owner.name}'s car collection</p>
          </div>

          {cars.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <div
                    key={car._id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                    onClick={() => navigate(`/car-details/${car._id}`)}
                  >
                    <div className="relative">
                      <img
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                        car.isAvaliable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {car.isAvaliable ? 'Available' : 'Unavailable'}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {car.category} • {car.year}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <img src={assets.users_icon} alt="Seats" className="w-4 h-4" />
                          <span>{car.seating_capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <img src={assets.fuel_icon} alt="Fuel" className="w-4 h-4" />
                          <span>{car.fuel_type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <img src={assets.car_icon} alt="Transmission" className="w-4 h-4" />
                          <span>{car.transmission}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <img src={assets.location_icon} alt="Location" className="w-4 h-4" />
                          <span className="text-sm text-gray-500">{car.location}</span>
                        </div>
                        <p className="text-lg font-bold text-blue-600">
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src={assets.car_icon} alt="No cars" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Cars Available</h3>
              <p className="text-gray-500">This owner hasn't added any cars yet.</p>
            </div>
          )}
        </div>

        {/* Recent Bookings Section */}
        {recentBookings.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Bookings</h2>
              <p className="text-gray-600">Latest bookings for {owner.name}'s cars</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <img 
                      src={booking.car.image} 
                      alt={booking.car.brand}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {booking.car.brand} {booking.car.model}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Booked by {booking.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(booking.price)}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
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
