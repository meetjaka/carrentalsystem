import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { assets } from "../assets/assets";

const MobileFilterSheet = ({ filters, onFilterChange, onClose, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = ["SUV", "Sedan", "Luxury", "Sports", "Van"];
  const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Gas"];
  const seats = [2, 4, 5, 7, 8];
  const brands = ["BMW", "Mercedes-Benz", "Audi", "Toyota", "Ford", "Jeep"];
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "priceLow", label: "Price: Low to High" },
    { value: "priceHigh", label: "Price: High to Low" },
    { value: "rating", label: "Rating" },
  ];

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply?.();
  };

  const handleCategoryToggle = (category) => {
    const current = localFilters.categories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setLocalFilters({ ...localFilters, categories: updated });
  };

  const handleSeatsToggle = (seat) => {
    const current = localFilters.seats || [];
    const updated = current.includes(seat)
      ? current.filter((s) => s !== seat)
      : [...current, seat];
    setLocalFilters({ ...localFilters, seats: updated });
  };

  const handleBrandToggle = (brand) => {
    const current = localFilters.brands || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    setLocalFilters({ ...localFilters, brands: updated });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile filters"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 right-0 bg-[#111721] rounded-t-3xl border-t border-[rgba(255,255,255,0.04)] shadow-[0_14px_40px_rgba(0,0,0,0.55)] max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#DCE7F5]">Filters</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#151D27] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                aria-label="Close filters"
              >
                <img
                  src={assets.close_icon}
                  alt=""
                  className="w-6 h-6 brightness-0 invert opacity-60"
                />
              </button>
            </div>

            <div className="space-y-6 pb-24">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#8DA0BF] mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] ${
                        localFilters.categories?.includes(cat)
                          ? "bg-[#0A4D9F] text-white"
                          : "bg-[#0A0F14] text-[#8DA0BF] border border-[rgba(255,255,255,0.04)]"
                      }`}
                      aria-pressed={localFilters.categories?.includes(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-[#8DA0BF] mb-3">
                  Price Range
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={localFilters.minPrice || ""}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, minPrice: e.target.value || null })
                    }
                    placeholder="Min"
                    className="flex-1 px-4 py-3 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                  />
                  <span className="text-[#8DA0BF]">-</span>
                  <input
                    type="number"
                    value={localFilters.maxPrice || ""}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, maxPrice: e.target.value || null })
                    }
                    placeholder="Max"
                    className="flex-1 px-4 py-3 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                  />
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label htmlFor="mobile-transmission" className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Transmission
                </label>
                <select
                  id="mobile-transmission"
                  value={localFilters.transmission || ""}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, transmission: e.target.value || null })
                  }
                  className="w-full px-4 py-3 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                >
                  <option value="">All</option>
                  {transmissions.map((trans) => (
                    <option key={trans} value={trans} className="bg-[#0F161C]">
                      {trans}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label htmlFor="mobile-fuel" className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Fuel Type
                </label>
                <select
                  id="mobile-fuel"
                  value={localFilters.fuelType || ""}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, fuelType: e.target.value || null })
                  }
                  className="w-full px-4 py-3 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                >
                  <option value="">All</option>
                  {fuelTypes.map((fuel) => (
                    <option key={fuel} value={fuel} className="bg-[#0F161C]">
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seats */}
              <div>
                <label className="block text-sm font-medium text-[#8DA0BF] mb-3">
                  Seating Capacity
                </label>
                <div className="flex flex-wrap gap-2">
                  {seats.map((seat) => (
                    <button
                      key={seat}
                      onClick={() => handleSeatsToggle(seat)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] ${
                        localFilters.seats?.includes(seat)
                          ? "bg-[#0A4D9F] text-white"
                          : "bg-[#0A0F14] text-[#8DA0BF] border border-[rgba(255,255,255,0.04)]"
                      }`}
                      aria-pressed={localFilters.seats?.includes(seat)}
                    >
                      {seat} Seats
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-[#8DA0BF] mb-3">
                  Brand
                </label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandToggle(brand)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] ${
                        localFilters.brands?.includes(brand)
                          ? "bg-[#0A4D9F] text-white"
                          : "bg-[#0A0F14] text-[#8DA0BF] border border-[rgba(255,255,255,0.04)]"
                      }`}
                      aria-pressed={localFilters.brands?.includes(brand)}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localFilters.available || false}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, available: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-[rgba(255,255,255,0.04)] bg-[#0A0F14] text-[#0A4D9F] focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                  />
                  <span className="text-sm font-medium text-[#8DA0BF]">Available Now</span>
                </label>
              </div>

              {/* Sort */}
              <div>
                <label htmlFor="mobile-sort" className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Sort By
                </label>
                <select
                  id="mobile-sort"
                  value={localFilters.sort || ""}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, sort: e.target.value || null })
                  }
                  className="w-full px-4 py-3 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                >
                  <option value="">Default</option>
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#0F161C]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sticky Apply Button */}
            <div className="sticky bottom-0 left-0 right-0 bg-[#111721] border-t border-[rgba(255,255,255,0.04)] p-4 -mx-6 -mb-6">
              <button
                onClick={handleApply}
                className="w-full py-3.5 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileFilterSheet;

