import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const addAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  let admin;
  const hashedPassword = bcrypt.hashSync(password);
  try {
    admin = new Admin({ email, password: hashedPassword });
    admin = await admin.save();
  } catch (err) {
    return console.log(err);
  }
  if (!admin) {
    return res.status(500).json({ message: "Unable to store admin" });
  }
  return res.status(201).json({ admin });
};

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingAdmin) {
    return res.status(400).json({ message: "Admin not found" });
  }
  const isPasswordCorrect = bcrypt.compareSync(
    password,
    existingAdmin.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  const token = jwt.sign(
    { id: existingAdmin._id, email: existingAdmin.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res
    .status(200)
    .json({ 
      message: "Authentication Complete", 
      token, 
      id: existingAdmin._id 
    });
};

export const getAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find();
  } catch (err) {
    return console.log(err);
  }
  if (!admins) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  return res.status(200).json({ admins });
};

export const getAdminById = async (req, res, next) => {
  const id = req.params.id;

  let admin;
  try {
    admin = await Admin.findById(id).populate("addedMovies");
  } catch (err) {
    return console.log(err);
  }
  if (!admin) {
    return console.log("Cannot find Admin");
  }
  return res.status(200).json({ admin });
};

export const getAdminBookings = async (req, res, next) => {
  const adminId = req.params.id;
  
  try {
    const admin = await Admin.findById(adminId).populate({
      path: 'bookings',
      populate: {
        path: 'movie user',
        select: 'title name email'
      }
    });
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    return res.status(200).json({ bookings: admin.bookings });
  } catch (err) {
    console.error("Error fetching admin bookings:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminStatistics = async (req, res, next) => {
  try {
    // 1. Statistici pentru distribuția spectacolelor pe genuri
    const genreStats = await Movie.aggregate([
      {
        $group: {
          _id: "$gen",
          count: { $sum: 1 }
        }
      }
    ]);

    // 2. Statistici pentru gradul de ocupare al sălilor
    const movies = await Movie.find();
    const bookings = await Bookings.find();
    
    const occupancyStats = {
      totalSeats: movies.reduce((sum, movie) => sum + movie.numarLocuri, 0),
      bookedSeats: bookings.length,
    };
    
    // 3. Distribuția rezervărilor pe zile ale săptămânii
    const weekdayStats = await Bookings.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$date" },
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. Top cele mai populare spectacole
    const popularMovies = await Movie.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "movie",
          as: "bookings"
        }
      },
      {
        $project: {
          title: 1,
          bookingsCount: { $size: "$bookings" }
        }
      },
      {
        $sort: { bookingsCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // 5. Statistici generale
    const totalMovies = await Movie.countDocuments();
    const totalBookings = await Bookings.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Bookings.aggregate([
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieDetails"
        }
      },
      {
        $unwind: "$movieDetails"
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$movieDetails.pret" }
        }
      }
    ]);

    // Convertim zilele săptămânii în format românesc
    const weekdayNames = {
      1: "Duminică",
      2: "Luni",
      3: "Marți",
      4: "Miercuri",
      5: "Joi",
      6: "Vineri",
      7: "Sâmbătă"
    };

    const formattedWeekdayStats = weekdayStats.map(stat => ({
      day: weekdayNames[stat._id],
      count: stat.count
    }));

    return res.status(200).json({
      statistics: {
        genreDistribution: genreStats,
        occupancyRate: {
          total: occupancyStats.totalSeats,
          booked: occupancyStats.bookedSeats,
          percentage: ((occupancyStats.bookedSeats / occupancyStats.totalSeats) * 100).toFixed(2)
        },
        weekdayDistribution: formattedWeekdayStats,
        popularMovies: popularMovies,
        general: {
          totalMovies,
          totalBookings,
          totalUsers,
          totalRevenue: totalRevenue[0]?.total || 0
        }
      }
    });
  } catch (err) {
    console.error("Error fetching statistics:", err);
    return res.status(500).json({ message: "Eroare la preluarea statisticilor" });
  }
};
