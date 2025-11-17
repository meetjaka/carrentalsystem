import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useEffect, useState, useCallback, useMemo } from "react";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import FilterBar from "../components/FilterBar";
import ExpandedFilterPanel from "../components/ExpandedFilterPanel";
import MobileFilterSheet from "../components/MobileFilterSheet";
import ActiveFilters from "../components/ActiveFilters";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const isSearchData = pickupLocation && pickupDate && returnDate;
  const [filteredCars, setFilteredCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExpandedFilters, setShowExpandedFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: null,
    maxPrice: null,
    transmission: null,
    fuelType: null,
    seats: [],
    brands: [],
    model: "",
    yearFrom: null,
    yearTo: null,
    available: false,
    sort: null,
  });

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories?.length > 0) count += filters.categories.length;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.transmission) count++;
    if (filters.fuelType) count++;
    if (filters.seats?.length > 0) count += filters.seats.length;
    if (filters.brands?.length > 0) count += filters.brands.length;
    if (filters.model) count++;
    if (filters.yearFrom || filters.yearTo) count++;
    if (filters.available) count++;
    return count;
  }, [filters]);

  // Apply filters to cars
  const applyFilters = useCallback(
    async (filterState = filters) => {
      setIsLoading(true);

      try {
        let result = [...cars];

        // Category filter
        if (filterState.categories?.length > 0) {
          result = result.filter((car) =>
            filterState.categories.includes(car.category)
          );
        }

        // Price filter
        if (filterState.minPrice) {
          result = result.filter((car) => car.pricePerDay >= filterState.minPrice);
        }
        if (filterState.maxPrice) {
          result = result.filter((car) => car.pricePerDay <= filterState.maxPrice);
        }

        // Transmission filter
        if (filterState.transmission) {
          result = result.filter(
            (car) => car.transmission === filterState.transmission
          );
        }

        // Fuel type filter
        if (filterState.fuelType) {
          result = result.filter((car) => car.fuel_type === filterState.fuelType);
        }

        // Seats filter
        if (filterState.seats?.length > 0) {
          result = result.filter((car) =>
            filterState.seats.includes(car.seating_capacity)
          );
        }

        // Brand filter
        if (filterState.brands?.length > 0) {
          result = result.filter((car) =>
            filterState.brands.includes(car.brand)
          );
        }

        // Model filter
        if (filterState.model) {
          const modelLower = filterState.model.toLowerCase();
          result = result.filter((car) =>
            car.model?.toLowerCase().includes(modelLower)
          );
        }

        // Year filter
        if (filterState.yearFrom) {
          result = result.filter((car) => car.year >= filterState.yearFrom);
        }
        if (filterState.yearTo) {
          result = result.filter((car) => car.year <= filterState.yearTo);
        }

        // Availability filter
        if (filterState.available) {
          result = result.filter((car) => car.isAvaliable === true);
        }

        // Sort
        if (filterState.sort) {
          switch (filterState.sort) {
            case "priceLow":
              result.sort((a, b) => a.pricePerDay - b.pricePerDay);
              break;
            case "priceHigh":
              result.sort((a, b) => b.pricePerDay - a.pricePerDay);
              break;
            case "newest":
              result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              break;
            default:
              break;
          }
        }

        setFilteredCars(result);
      } catch (error) {
        console.error("Filter error:", error);
        toast.error("Error applying filters");
      } finally {
        setIsLoading(false);
      }
    },
    [cars, filters]
  );

  // Debounced filter application
  const debouncedApplyFilters = useMemo(
    () => debounce(applyFilters, 300),
    [applyFilters]
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      debouncedApplyFilters(newFilters);
    },
    [debouncedApplyFilters]
  );

  // Handle remove filter
  const handleRemoveFilter = useCallback(
    (filterType, value = null) => {
      const newFilters = { ...filters };
      switch (filterType) {
        case "category":
          newFilters.categories = newFilters.categories?.filter((c) => c !== value) || [];
          break;
        case "price":
          newFilters.minPrice = null;
          newFilters.maxPrice = null;
          break;
        case "transmission":
          newFilters.transmission = null;
          break;
        case "fuelType":
          newFilters.fuelType = null;
          break;
        case "seat":
          newFilters.seats = newFilters.seats?.filter((s) => s !== value) || [];
          break;
        case "brand":
          newFilters.brands = newFilters.brands?.filter((b) => b !== value) || [];
          break;
        case "model":
          newFilters.model = "";
          break;
        case "year":
          newFilters.yearFrom = null;
          newFilters.yearTo = null;
          break;
        case "available":
          newFilters.available = false;
          break;
        default:
          break;
      }
      handleFilterChange(newFilters);
    },
    [filters, handleFilterChange]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      categories: [],
      minPrice: null,
      maxPrice: null,
      transmission: null,
      fuelType: null,
      seats: [],
      brands: [],
      model: "",
      yearFrom: null,
      yearTo: null,
      available: false,
      sort: null,
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  }, [applyFilters]);

  // Search car availability (from hero search)
  const searchCarAvailability = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/booking/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        setFilteredCars(data.availableCars);
        if (data.availableCars.length === 0) {
          toast("No Cars Available");
        }
      }
    } catch (error) {
      toast.error("Error checking availability");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    } else if (cars.length > 0) {
      setFilteredCars(cars);
    }
  }, [pickupLocation, pickupDate, returnDate, isSearchData]);

  // Apply filters when cars change
  useEffect(() => {
    if (cars.length > 0 && !isSearchData) {
      applyFilters();
    }
  }, [cars, isSearchData, applyFilters]);

  return (
    <div className="min-h-screen bg-[#0A0F14]">
      {/* Header Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center py-12 md:py-20 bg-[#0A0F14] px-4 md:px-6"
      >
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />
      </motion.div>

      {/* Filter Bar - Desktop */}
      <div className="hidden lg:block px-6 md:px-16 lg:px-24 xl:px-32 mb-6">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
          isLoading={isLoading}
          onShowMoreFilters={() => setShowExpandedFilters(true)}
        />
      </div>

      {/* Mobile Filter Bar */}
      <div className="lg:hidden sticky top-16 z-40 bg-[#0A0F14] border-b border-[rgba(255,255,255,0.04)] p-4">
        <div className="flex items-center justify-center">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full px-4 py-2.5 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)] relative"
            aria-label="Open filters"
          >
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#083A78] rounded-full text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filters */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mb-6">
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearFilters}
        />
      </div>

      {/* Results Section */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#111721] rounded-2xl h-96 animate-pulse"
              />
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <>
            <p className="text-[#8DA0BF] mb-4 max-w-7xl mx-auto">
              Showing {filteredCars.length} car{filteredCars.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredCars.map((car, index) => (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  key={car._id || index}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-[#DCE7F5] mb-2">
              No cars found
            </h3>
            <p className="text-[#8DA0BF] mb-6">
              Try adjusting your filters or search terms to find more results.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-[#0A4D9F] hover:bg-[#083A78] text-white rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(10,77,159,0.12)]"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Expanded Filter Panel - Desktop/Tablet */}
      {showExpandedFilters && (
        <ExpandedFilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowExpandedFilters(false)}
          onApply={() => setShowExpandedFilters(false)}
        />
      )}

      {/* Mobile Filter Sheet */}
      {showMobileFilters && (
        <MobileFilterSheet
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowMobileFilters(false)}
          onApply={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
};

export default Cars;
