import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { assets } from "../assets/assets";

const FilterBar = ({
  filters,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
  isLoading,
  onShowMoreFilters,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const categories = ["SUV", "Sedan", "Luxury", "Sports", "Van"];
  const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Gas"];
  const seats = [2, 4, 5, 7, 8];
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "priceLow", label: "Price: Low to High" },
    { value: "priceHigh", label: "Price: High to Low" },
    { value: "rating", label: "Rating" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryToggle = (category) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFilterChange({ ...filters, categories: updated });
  };

  const handleSeatsToggle = (seat) => {
    const current = filters.seats || [];
    const updated = current.includes(seat)
      ? current.filter((s) => s !== seat)
      : [...current, seat];
    onFilterChange({ ...filters, seats: updated });
  };

  const handleTransmissionChange = (transmission) => {
    onFilterChange({ ...filters, transmission });
    setOpenDropdown(null);
  };

  const handleFuelTypeChange = (fuelType) => {
    onFilterChange({ ...filters, fuelType });
    setOpenDropdown(null);
  };

  const handleSortChange = (sort) => {
    onFilterChange({ ...filters, sort });
    setOpenDropdown(null);
  };

  const handleAvailabilityToggle = () => {
    onFilterChange({ ...filters, available: !filters.available });
  };

  return (
    <div className="w-full">
      {/* Main Filter Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#111721] rounded-2xl p-4 md:p-6 border border-[rgba(255,255,255,0.04)] shadow-[0_14px_40px_rgba(0,0,0,0.55)]"
        role="search"
        aria-label="Car filters"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#8DA0BF] hidden md:inline">Category:</span>
            {categories.slice(0, 3).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  filters.categories?.includes(cat)
                    ? "bg-[#0A4D9F] text-white"
                    : "bg-[#0A0F14] text-[#8DA0BF] border border-[rgba(255,255,255,0.04)] hover:bg-[#151D27]"
                } focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]`}
                aria-pressed={filters.categories?.includes(cat)}
                aria-label={`Filter by ${cat} category`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <label htmlFor="min-price" className="text-xs text-[#8DA0BF] hidden md:inline">
              Price:
            </label>
            <div className="flex items-center gap-2">
              <input
                id="min-price"
                type="number"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  onFilterChange({ ...filters, minPrice: e.target.value || null })
                }
                placeholder="Min"
                className="w-20 px-3 py-2 bg-[#0A0F14] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:border-[rgba(10,77,159,0.3)] transition-all"
                aria-label="Minimum price"
              />
              <span className="text-[#8DA0BF]">-</span>
              <input
                id="max-price"
                type="number"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  onFilterChange({ ...filters, maxPrice: e.target.value || null })
                }
                placeholder="Max"
                className="w-20 px-3 py-2 bg-[#0A0F14] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.3)] focus:border-[rgba(10,77,159,0.3)] transition-all"
                aria-label="Maximum price"
              />
            </div>
          </div>

          {/* Transmission Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenDropdown(openDropdown === "transmission" ? null : "transmission")}
              className="px-4 py-2 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] text-sm hover:bg-[#151D27] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] transition-all"
              aria-haspopup="true"
              aria-expanded={openDropdown === "transmission"}
              aria-label="Filter by transmission"
            >
              {filters.transmission || "Transmission"}
              <span className="ml-2">▼</span>
            </button>
            <AnimatePresence>
              {openDropdown === "transmission" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 z-50 bg-[#111721] border border-[rgba(255,255,255,0.04)] rounded-xl shadow-[0_14px_40px_rgba(0,0,0,0.55)] min-w-[180px]"
                  role="menu"
                >
                  {transmissions.map((trans) => (
                    <button
                      key={trans}
                      onClick={() => handleTransmissionChange(trans)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        filters.transmission === trans
                          ? "bg-[#0A4D9F] text-white"
                          : "text-[#DCE7F5] hover:bg-[#151D27]"
                      } first:rounded-t-xl last:rounded-b-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]`}
                      role="menuitem"
                    >
                      {trans}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fuel Type Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenDropdown(openDropdown === "fuel" ? null : "fuel")}
              className="px-4 py-2 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] text-sm hover:bg-[#151D27] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] transition-all"
              aria-haspopup="true"
              aria-expanded={openDropdown === "fuel"}
              aria-label="Filter by fuel type"
            >
              {filters.fuelType || "Fuel"}
              <span className="ml-2">▼</span>
            </button>
            <AnimatePresence>
              {openDropdown === "fuel" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 z-50 bg-[#111721] border border-[rgba(255,255,255,0.04)] rounded-xl shadow-[0_14px_40px_rgba(0,0,0,0.55)] min-w-[180px]"
                  role="menu"
                >
                  {fuelTypes.map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => handleFuelTypeChange(fuel)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        filters.fuelType === fuel
                          ? "bg-[#0A4D9F] text-white"
                          : "text-[#DCE7F5] hover:bg-[#151D27]"
                      } first:rounded-t-xl last:rounded-b-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]`}
                      role="menuitem"
                    >
                      {fuel}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Availability Toggle */}
          <button
            onClick={handleAvailabilityToggle}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] ${
              filters.available
                ? "bg-[#0A4D9F] text-white"
                : "bg-[#0A0F14] text-[#8DA0BF] border border-[rgba(255,255,255,0.04)] hover:bg-[#151D27]"
            }`}
            aria-pressed={filters.available}
            aria-label="Filter available cars only"
          >
            Available
          </button>

          {/* Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
              className="px-4 py-2 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] text-sm hover:bg-[#151D27] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] transition-all"
              aria-haspopup="true"
              aria-expanded={openDropdown === "sort"}
              aria-label="Sort options"
            >
              {sortOptions.find((opt) => opt.value === filters.sort)?.label || "Sort"}
              <span className="ml-2">▼</span>
            </button>
            <AnimatePresence>
              {openDropdown === "sort" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 right-0 z-50 bg-[#111721] border border-[rgba(255,255,255,0.04)] rounded-xl shadow-[0_14px_40px_rgba(0,0,0,0.55)] min-w-[200px]"
                  role="menu"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortChange(opt.value)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        filters.sort === opt.value
                          ? "bg-[#0A4D9F] text-white"
                          : "text-[#DCE7F5] hover:bg-[#151D27]"
                      } first:rounded-t-xl last:rounded-b-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]`}
                      role="menuitem"
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clear Filters & More Filters */}
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={onClearFilters}
                className="px-4 py-2 text-sm text-[#8DA0BF] hover:text-[#DCE7F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] rounded-xl"
                aria-label="Clear all filters"
              >
                Clear
              </button>
            )}
            {onShowMoreFilters && (
              <button
                onClick={onShowMoreFilters}
                className="px-4 py-2 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                aria-label="Show more filters"
              >
                More Filters
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterBar;

