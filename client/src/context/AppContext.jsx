// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const currency = import.meta.env.VITE_CURRENCY;
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isOwner, setIsOwner] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [pickupDate, setPickupDate] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [cars, setCars] = useState([]);
//   const [favorites, setFavorites] = useState([]);
  

//   //   function to check if user is loggedin
//   const fetchUser = async () => {
//     try {
//       const { data } = await axios.get("/api/user/data");
//       if (data.success) {
//         setUser(data.user);
//         setIsOwner(data.user.role === "owner");
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // function to fetch all cars from the server
//   const fetchCars = async () => {
//     try {
//       const { data } = await axios.get("/api/user/cars");
//       data.success ? setCars(data.cars) : toast.error(data.message);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // function to logout the user
//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("favorites");
//     setToken(null);
//     setUser(null);
//     setIsOwner(false);
//     setFavorites([]);
//     axios.defaults.headers.common["Authorization"] = "";
//     toast.success("You have benn logged Out");
//   };

//   // function to toggle favorite
//   const toggleFavorite = (carId) => {
//     const isFavorited = favorites.includes(carId);
//     if (isFavorited) {
//       const newFavorites = favorites.filter(id => id !== carId);
//       setFavorites(newFavorites);
//       localStorage.setItem("favorites", JSON.stringify(newFavorites));
//     } else {
//       const newFavorites = [...favorites, carId];
//       setFavorites(newFavorites);
//       localStorage.setItem("favorites", JSON.stringify(newFavorites));
//     }
//   };

//   // function to check if car is favorited
//   const isFavorited = (carId) => {
//     return favorites.includes(carId);
//   };

//   // useeffect to retreive token from local storage
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const savedFavorites = localStorage.getItem("favorites");
//     setToken(token);
//     if (savedFavorites) {
//       setFavorites(JSON.parse(savedFavorites));
//     }
//     fetchCars();
//   }, []);

//   // useffect to fetch user date whe token is avilable
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//       fetchUser();
//     }
//   });

//   const value = {
//     navigate,
//     currency,
//     axios,
//     user,
//     setUser,
//     token,
//     setToken,
//     isOwner,
//     setIsOwner,
//     fetchCars,
//     fetchUser,
//     showLogin,
//     setShowLogin,
//     logout,
//     cars,
//     setCars,
//     pickupDate,
//     setPickupDate,
//     returnDate,
//     setReturnDate,
//     favorites,
//     setFavorites,
//     toggleFavorite,
//     isFavorited,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => {
//   return useContext(AppContext);
// };



import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // === NEW: State for theme management ===
  // It checks localStorage for a saved theme, otherwise defaults to 'dark'.
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // === NEW: useEffect to apply and save the theme ===
  useEffect(() => {
    const root = window.document.documentElement;
    // Remove the opposite theme class to prevent conflicts
    root.classList.remove(theme === "dark" ? "light" : "dark");
    // Add the current theme class
    root.classList.add(theme);
    // Save the user's preference in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);


  //   function to check if user is loggedin
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to fetch all cars from the server
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to logout the user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("favorites");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    setFavorites([]);
    axios.defaults.headers.common["Authorization"] = "";
    toast.success("You have been logged Out");
  };

  // function to toggle favorite
  const toggleFavorite = (carId) => {
    const isFavorited = favorites.includes(carId);
    if (isFavorited) {
      const newFavorites = favorites.filter((id) => id !== carId);
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favorites, carId];
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  // function to check if car is favorited
  const isFavorited = (carId) => {
    return favorites.includes(carId);
  };

  // useeffect to retreive token from local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedFavorites = localStorage.getItem("favorites");
    setToken(token);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    fetchCars();
  }, []);

  // useffect to fetch user date whe token is avilable
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    }
  }, [token]); // Added token as a dependency for correctness

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchCars,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    favorites,
    setFavorites,
    toggleFavorite,
    isFavorited,
    // === NEW: Exporting theme state and setter ===
    theme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};