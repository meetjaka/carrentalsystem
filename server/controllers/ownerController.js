import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import fs from "fs";

// Public API to get all cars by ownerId
export const getCarsByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;
    console.log("Requested ownerId:", ownerId);
    const cars = await Car.find({ owner: ownerId }).populate("owner", "name");
    console.log("Cars found:", cars);
    // Attach ownerName to each car for frontend convenience
    const carsWithOwner = cars.map((car) => ({
      ...car._doc,
      ownerName: car.owner?.name || "",
    }));
    res.json({ success: true, cars: carsWithOwner });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Enhanced API to get detailed owner information with statistics
export const getOwnerDetails = async (req, res) => {
  try {
    const { ownerId } = req.params;
    console.log("Requested ownerId for details:", ownerId);
    
    // Get owner information
    const owner = await User.findById(ownerId).select("name email image role createdAt");
    if (!owner) {
      return res.json({ success: false, message: "Owner not found" });
    }

    // Get owner's cars with detailed information
    const cars = await Car.find({ owner: ownerId }).sort({ createdAt: -1 });
    
    // Get booking statistics
    const totalBookings = await Booking.countDocuments({ owner: ownerId });
    const confirmedBookings = await Booking.countDocuments({ 
      owner: ownerId, 
      status: "confirmed" 
    });
    const pendingBookings = await Booking.countDocuments({ 
      owner: ownerId, 
      status: "pending" 
    });
    
    // Calculate total revenue
    const revenueBookings = await Booking.find({ 
      owner: ownerId, 
      status: "confirmed" 
    });
    const totalRevenue = revenueBookings.reduce((sum, booking) => sum + booking.price, 0);
    
    // Calculate average rating (if you have rating system)
    const averageRating = 4.5; // Placeholder - implement rating system if needed
    
    // Get recent bookings
    const recentBookings = await Booking.find({ owner: ownerId })
      .populate("car", "brand model image")
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const ownerDetails = {
      owner: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        image: owner.image,
        role: owner.role,
        memberSince: owner.createdAt,
      },
      statistics: {
        totalCars: cars.length,
        availableCars: cars.filter(car => car.isAvaliable).length,
        totalBookings,
        confirmedBookings,
        pendingBookings,
        totalRevenue,
        averageRating,
      },
      cars: cars.map(car => ({
        ...car._doc,
        ownerName: owner.name,
      })),
      recentBookings: recentBookings.map(booking => ({
        _id: booking._id,
        car: booking.car,
        user: booking.user,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        status: booking.status,
        price: booking.price,
        createdAt: booking.createdAt,
      })),
    };

    res.json({ success: true, data: ownerDetails });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
// Api to change role
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { role: "owner" });

    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to list Car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    // upload image to image kit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // optimate thorugh imagekit url
    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" }, // width resize
        { quality: "auto" }, //auto compression
        { format: "webp" }, //convert to modern format
      ],
    });
    res.json({ success: true, message: "Car Added" });

    const image = optimizedImageUrl;
    await Car.create({ ...car, owner: _id, image });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to List owner Cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to change Car Avialabiliy
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    // check car bleongs to owner or not
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.isAvaliable = !car.isAvaliable;
    await car.save();

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
// Api to delete a car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    // check car bleongs to owner or not
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvaliable = false;

    await car.save();

    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to get Dashboard Data

export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });
    const completedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    // calculate monthlyrevenue from bookings
    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
    console.log("Dashboard access by:", req.user);
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to update user image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    const imageFile = req.file;

    // upload image to image kit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // optimate thorugh imagekit url
    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" }, // width resize
        { quality: "auto" }, //auto compression
        { format: "webp" }, //convert to modern format
      ],
    });

    const image = optimizedImageUrl;
    await User.findByIdAndUpdate(_id, { image });
    res.json({ success: true, message: "Image Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
