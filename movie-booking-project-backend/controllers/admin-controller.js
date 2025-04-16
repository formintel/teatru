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
  const adminId = req.params.id;
  
  try {
    const admin = await Admin.findById(adminId);
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    // Calculează statisticile
    const totalBookings = admin.bookings.length;
    const totalMovies = admin.addedMovies.length;
    
    // Calculează venitul total din bookings
    const bookings = await Bookings.find({ _id: { $in: admin.bookings } });
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    
    // Actualizează statisticile în baza de date
    admin.statistics = {
      totalBookings,
      totalRevenue,
      totalMovies
    };
    await admin.save();
    
    return res.status(200).json({ statistics: admin.statistics });
  } catch (err) {
    console.error("Error fetching admin statistics:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
