import React from "react";
import { motion, AnimatePresence } from "motion/react";
import FilterChip from "./FilterChip";

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const activeFilters = [];

  // Build active filter chips
  if (filters.categories?.length > 0) {
    filters.categories.forEach((cat) => {
      activeFilters.push({
        key: `category-${cat}`,
        label: cat,
        onRemove: () => onRemoveFilter("category", cat),
      });
    });
  }

  if (filters.minPrice || filters.maxPrice) {
    const priceLabel = filters.minPrice && filters.maxPrice
      ? `₹${filters.minPrice} - ₹${filters.maxPrice}`
      : filters.minPrice
      ? `From ₹${filters.minPrice}`
      : `Up to ₹${filters.maxPrice}`;
    activeFilters.push({
      key: "price",
      label: priceLabel,
      onRemove: () => onRemoveFilter("price"),
    });
  }

  if (filters.transmission) {
    activeFilters.push({
      key: "transmission",
      label: filters.transmission,
      onRemove: () => onRemoveFilter("transmission"),
    });
  }

  if (filters.fuelType) {
    activeFilters.push({
      key: "fuelType",
      label: filters.fuelType,
      onRemove: () => onRemoveFilter("fuelType"),
    });
  }

  if (filters.seats?.length > 0) {
    filters.seats.forEach((seat) => {
      activeFilters.push({
        key: `seat-${seat}`,
        label: `${seat} Seats`,
        onRemove: () => onRemoveFilter("seat", seat),
      });
    });
  }

  if (filters.brands?.length > 0) {
    filters.brands.forEach((brand) => {
      activeFilters.push({
        key: `brand-${brand}`,
        label: brand,
        onRemove: () => onRemoveFilter("brand", brand),
      });
    });
  }

  if (filters.model) {
    activeFilters.push({
      key: "model",
      label: `Model: ${filters.model}`,
      onRemove: () => onRemoveFilter("model"),
    });
  }

  if (filters.yearFrom || filters.yearTo) {
    const yearLabel = filters.yearFrom && filters.yearTo
      ? `${filters.yearFrom} - ${filters.yearTo}`
      : filters.yearFrom
      ? `From ${filters.yearFrom}`
      : `Up to ${filters.yearTo}`;
    activeFilters.push({
      key: "year",
      label: yearLabel,
      onRemove: () => onRemoveFilter("year"),
    });
  }

  if (filters.available) {
    activeFilters.push({
      key: "available",
      label: "Available Now",
      onRemove: () => onRemoveFilter("available"),
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 mb-4"
      role="region"
      aria-label="Active filters"
    >
      <span className="text-sm text-[#8DA0BF] mr-2">
        {activeFilters.length} filter{activeFilters.length !== 1 ? "s" : ""} active
      </span>
      <AnimatePresence>
        {activeFilters.map((filter) => (
          <FilterChip
            key={filter.key}
            label={filter.label}
            onRemove={filter.onRemove}
            ariaLabel={`Active filter: ${filter.label}`}
          />
        ))}
      </AnimatePresence>
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="px-3 py-1.5 text-sm text-[#8DA0BF] hover:text-[#DCE7F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] rounded-xl"
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </motion.div>
  );
};

export default ActiveFilters;

