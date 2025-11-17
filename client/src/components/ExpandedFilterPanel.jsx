import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const ExpandedFilterPanel = ({ filters, onFilterChange, onClose, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const brands = ["BMW", "Mercedes-Benz", "Audi", "Toyota", "Ford", "Jeep"];
  const seats = [2, 4, 5, 7, 8];

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply?.();
  };

  const handleBrandToggle = (brand) => {
    const current = localFilters.brands || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    setLocalFilters({ ...localFilters, brands: updated });
  };

  const handleSeatsToggle = (seat) => {
    const current = localFilters.seats || [];
    const updated = current.includes(seat)
      ? current.filter((s) => s !== seat)
      : [...current, seat];
    setLocalFilters({ ...localFilters, seats: updated });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Expanded filters panel"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#111721] rounded-2xl border border-[rgba(255,255,255,0.04)] shadow-[0_14px_40px_rgba(0,0,0,0.55)] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#DCE7F5]">More Filters</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#151D27] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                aria-label="Close filters"
              >
                <span className="text-[#8DA0BF] text-xl">×</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Brand Selection */}
              <div>
                <label className="block text-sm font-medium text-[#8DA0BF] mb-3">
                  Brand
                </label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandToggle(brand)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] ${
                        localFilters.brands?.includes(brand)
                          ? "bg-[#0A4D9F] text-white"
                          : "bg-[#0A0F14] text-[#8DA0BF] border border-[rgba(255,255,255,0.04)] hover:bg-[#151D27]"
                      }`}
                      aria-pressed={localFilters.brands?.includes(brand)}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Input */}
              <div>
                <label htmlFor="model-input" className="block text-sm font-medium text-[#8DA0BF] mb-2">
                  Model
                </label>
                <input
                  id="model-input"
                  type="text"
                  value={localFilters.model || ""}
                  onChange={(e) => setLocalFilters({ ...localFilters, model: e.target.value })}
                  placeholder="e.g., X5, A6, C-Class"
                  className="w-full px-4 py-2.5 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                  aria-label="Filter by car model"
                />
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium text-[#8DA0BF] mb-3">
                  Year Range
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor="year-from" className="block text-xs text-[#8DA0BF] mb-1">
                      From
                    </label>
                    <input
                      id="year-from"
                      type="number"
                      value={localFilters.yearFrom || ""}
                      onChange={(e) =>
                        setLocalFilters({ ...localFilters, yearFrom: e.target.value || null })
                      }
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-2.5 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                      aria-label="Year from"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="year-to" className="block text-xs text-[#8DA0BF] mb-1">
                      To
                    </label>
                    <input
                      id="year-to"
                      type="number"
                      value={localFilters.yearTo || ""}
                      onChange={(e) =>
                        setLocalFilters({ ...localFilters, yearTo: e.target.value || null })
                      }
                      placeholder={new Date().getFullYear()}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-2.5 bg-[#0A0F14] border border-[rgba(255,255,255,0.04)] rounded-xl text-[#DCE7F5] placeholder:text-[#8DA0BF] focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
                      aria-label="Year to"
                    />
                  </div>
                </div>
              </div>

              {/* Price Slider */}
              <div>
                <label className="block text-sm font-medium text-[#8DA0BF] mb-3">
                  Daily Price Range
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={localFilters.minPrice || 0}
                      onChange={(e) =>
                        setLocalFilters({ ...localFilters, minPrice: parseInt(e.target.value) })
                      }
                      className="w-full"
                      aria-label="Minimum price slider"
                    />
                    <div className="text-xs text-[#8DA0BF] mt-1">
                      Min: ₹{localFilters.minPrice || 0}
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={localFilters.maxPrice || 1000}
                      onChange={(e) =>
                        setLocalFilters({ ...localFilters, maxPrice: parseInt(e.target.value) })
                      }
                      className="w-full"
                      aria-label="Maximum price slider"
                    />
                    <div className="text-xs text-[#8DA0BF] mt-1">
                      Max: ₹{localFilters.maxPrice || 1000}
                    </div>
                  </div>
                </div>
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
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] ${
                        localFilters.seats?.includes(seat)
                          ? "bg-[#0A4D9F] text-white"
                          : "bg-[#0A0F14] text-[#8DA0BF] border border-[rgba(255,255,255,0.04)] hover:bg-[#151D27]"
                      }`}
                      aria-pressed={localFilters.seats?.includes(seat)}
                    >
                      {seat} Seats
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[rgba(255,255,255,0.04)]">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-[#8DA0BF] hover:text-[#DCE7F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2.5 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
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

export default ExpandedFilterPanel;

