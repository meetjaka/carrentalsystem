import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();

  const [cars, setCars] = useState([]);
  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });

      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm(
        "Are You sure you want to delete this car?"
      );
      if (!confirm) return null;
      const { data } = await axios.post("/api/owner/delete-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 w-full bg-[#0A0F14] min-h-screen">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />
      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-[rgba(255,255,255,0.04)] bg-[#121A22] mt-6">
        <table className="w-full border-collapse text-left text-sm text-[#8DA0BF]">
          <thead className="text-[#DCE7F5]">
            <tr>
              <th className="p-3 font-medium ">Car</th>
              <th className="p-3 font-medium  max-md:hidden">Category</th>
              <th className="p-3 font-medium ">Price</th>
              <th className="p-3 font-medium max-md:hidden ">Status</th>
              <th className="p-3 font-medium ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="border-t border-[rgba(255,255,255,0.04)]">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    alt=""
                    className="h-12 w-12 aspect-square rounded-md object-cover brightness-[0.94] contrast-[1.02]"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium text-[#DCE7F5]">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-[#8DA0BF]">
                      {car.seating_capacity} • {car.transmission}
                    </p>
                  </div>
                </td>
                <td className="p-3 max-md:hidden text-[#8DA0BF]">{car.category}</td>
                <td className="p-3 text-[#0A4D9F] font-medium">
                  {currency}
                  {car.pricePerDay}/day
                </td>
                <td className="p-3 max-md:hiddent">
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${
                      car.isAvaliable
                        ? "bg-[#16A34A] text-white"
                        : "bg-[#EF4444] text-white"
                    }`}
                  >
                    {car.isAvaliable ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="flex items-center p-3">
                  <img
                    onClick={() => toggleAvailability(car._id)}
                    src={
                      car.isAvaliable ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt=""
                    className="cursor-pointer brightness-0 invert opacity-60 hover:opacity-100 hover:brightness-0 hover:invert hover:sepia-[100%] hover:saturate-[10000%] hover:hue-rotate-[200deg] transition-all"
                  />
                  <img
                    onClick={() => deleteCar(car._id)}
                    src={assets.delete_icon}
                    alt=""
                    className="cursor-pointer brightness-0 invert opacity-60 hover:opacity-100 transition-all"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
