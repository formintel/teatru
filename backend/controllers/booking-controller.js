import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const newBooking = async (req, res, next) => {
  console.log("Request body pentru noua rezervare:", req.body);
  
  const { movie, date, seatNumbers, seatNumber, user, showTimeId } = req.body;

  // Verificăm dacă utilizatorul este admin
  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    return res.status(401).json({ message: "Token Not Found" });
  }

  let userId;
  try {
    const decrypted = jwt.verify(extractedToken, process.env.JWT_SECRET);
    userId = decrypted.id;
    
    // Verificăm dacă utilizatorul este admin
    const adminUser = await Admin.findById(userId);
    if (adminUser) {
      return res.status(403).json({ 
        message: "Adminii nu pot face rezervări. Vă rugăm să folosiți un cont de utilizator normal." 
      });
    }
  } catch (err) {
    console.log("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid Token" });
  }

  // Validare câmpuri obligatorii
  if (!movie || !date || (!seatNumbers && !seatNumber) || !user || !showTimeId) {
    console.log("Câmpuri lipsă:", { movie, date, seatNumbers, seatNumber, user, showTimeId });
    return res.status(400).json({ 
      message: "Toate câmpurile sunt obligatorii",
      missing: {
        movie: !movie,
        date: !date,
        seatNumbers: !seatNumbers && !seatNumber,
        user: !user,
        showTimeId: !showTimeId
      }
    });
  }

  // Convertim seatNumber în seatNumbers dacă este necesar
  const seatsToBook = seatNumbers || [seatNumber];

  let existingMovie;
  let existingUser;
  try {
    console.log("Căutăm filmul cu ID:", movie);
    existingMovie = await Movie.findById(movie);
    console.log("Film găsit:", existingMovie ? "Da" : "Nu");
    
    console.log("Căutăm utilizatorul cu ID:", user);
    existingUser = await User.findById(user);
    console.log("Utilizator găsit:", existingUser ? "Da" : "Nu");
  } catch (err) {
    console.error("Eroare la căutarea filmului sau utilizatorului:", err);
    return res.status(500).json({ 
      message: "Eroare la validarea datelor",
      error: err.message 
    });
  }

  if (!existingMovie) {
    console.error("Filmul nu a fost găsit cu ID:", movie);
    return res.status(404).json({ 
      message: "Filmul nu a fost găsit",
      movieId: movie 
    });
  }
  if (!existingUser) {
    console.error("Utilizatorul nu a fost găsit cu ID:", user);
    return res.status(404).json({ 
      message: "Utilizatorul nu a fost găsit",
      userId: user 
    });
  }

  try {
    console.log("Creăm rezervările pentru locurile:", seatsToBook);
    
    // Creăm o rezervare pentru fiecare loc
    const bookings = await Promise.all(seatsToBook.map(async (seatNumber) => {
      const booking = new Bookings({
        movie,
        date: new Date(date),
        seatNumber,
        user,
        showTimeId
      });

      await booking.save();
      console.log(`Rezervare salvată cu succes pentru locul ${seatNumber}:`, booking._id);

      return booking;
    }));

    // Actualizăm utilizatorul cu toate rezervările
    existingUser.bookings.push(...bookings);
    await existingUser.save();
    console.log("Utilizator actualizat cu rezervările");

    // Actualizăm filmul cu toate rezervările
    existingMovie.bookings.push(...bookings);
    await existingMovie.save();
    console.log("Film actualizat cu rezervările");

    return res.status(201).json({ 
      message: "Rezervări create cu succes",
      bookings 
    });
  } catch (err) {
    console.error("Eroare la crearea rezervărilor:", err);
    return res.status(500).json({ 
      message: "Eroare la crearea rezervărilor",
      error: err.message 
    });
  }
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findByIdAndRemove(id).populate("user movie");
    console.log(booking);
    
    if (booking && booking.user && booking.movie) {
      await booking.user.bookings.pull(booking);
      await booking.movie.bookings.pull(booking);
      await booking.movie.save();
      await booking.user.save();
    }
  } catch (err) {
    console.log("Eroare la ștergerea rezervării:", err);
    return res.status(500).json({ message: "Eroare la ștergerea rezervării" });
  }
  
  if (!booking) {
    return res.status(500).json({ message: "Unable to Delete" });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { movieId, showTimeId } = req.query;
    //console.log("Request received for occupied seats:", { movieId, showTimeId });
    
    if (!movieId || !showTimeId) {
      return res.status(400).json({
        success: false,
        message: "Trebuie să specificați ID-ul filmului și ID-ul reprezentației"
      });
    }
    
    //console.log("Searching for bookings with:", { movie: movieId, showTimeId });
    const bookings = await Bookings.find({
      movie: movieId,
      showTimeId: showTimeId,
    }).select("seatNumber -_id");;
    
   //console.log("Found bookings:", bookings);
    const occupiedSeats = bookings.map(booking => booking.seatNumber);
    
    return res.status(200).json({
      success: true,
      occupiedSeats
    });
  } catch (error) {
    console.error("Server error retrieving occupied seats:", error);
    return res.status(500).json({
      success: false,
      message: "Nu s-au putut încărca locurile ocupate",
      error: error.message
    });
  }
};
