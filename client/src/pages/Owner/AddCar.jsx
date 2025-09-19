import React, { useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddCar = () => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
    pricePerDay: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return null;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 0,
          location: "",
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle=" Fill in details to list a new car for booking, including pricing, availability and car specifications."
      />
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        {/* Car Image  */}

        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image" className="cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="Car preview"
              className="h-14 rounded"
            />
          </label>
          <input
            type="file"
            id="car-image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <p className="text-sm text-gray-500">Upload a picture of your car</p>
        </div>

        {/* Car brand and model  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Brand</label>
            <input
              type="text"
              placeholder="e.g BMW, Mercedes, Audi ..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Model</label>
            <input
              type="text"
              placeholder="e.g XS, E-Class,M4...."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* Car Year price and category  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Year</label>
            <input
              type="number"
              placeholder="e.g 2025"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              placeholder="enter price per day"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Category</label>
            <select
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              value={car.category}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a Category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>
          </div>
        </div>

        {/* Car transmission fuel type and seating capaticy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Tramsission</label>
            <select
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a Tranmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label>Fuel Type</label>
            <select
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              value={car.fuel_type}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Gas">Gas</option>
              <option value="Electric">Electic</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label>Seats</label>
            <input
              type="number"
              placeholder="4"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({ ...car, seating_capacity: e.target.value })
              }
            />
          </div>
        </div>

        {/* Car location  */}

        <div className="flex flex-col w-full">
          <label>Location</label>
          <input
            type="text"
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            placeholder="Type city name..."
            value={car.location}
            onChange={async (e) => {
              const value = e.target.value;
              setCar({ ...car, location: value });
              if (value.length >= 2) {
                // Fetch city suggestions from a public API
                const res = await fetch(
                  `https://api.teleport.org/api/cities/?search=${value}&limit=5`
                );
                const data = await res.json();
                setCitySuggestions(
                  data._embedded["city:search-results"].map(
                    (c) => c.matching_full_name
                  )
                );
              } else {
                setCitySuggestions([]);
              }
            }}
            autoComplete="off"
          />
          {citySuggestions?.length > 0 && (
            <div className="border border-borderColor rounded-md bg-white mt-1 absolute z-10 w-full max-h-40 overflow-y-auto">
              {citySuggestions.map((city, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setCar({ ...car, location: city });
                    setCitySuggestions([]);
                  }}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Car Descriptio */}
        <div className="flex flex-col w-full">
          <label>Description</label>
          <textarea
            rows={5}
            placeholder="e.g luxurious SUV with a spacious interior and a powerful engine."
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          >
            {" "}
          </textarea>

          <button className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer ">
            <img src={assets.tick_icon} alt="" />
            {isLoading ? "Listing..." : "List Your Car"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCar;
