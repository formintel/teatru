import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user, showTimeId } = req.body; // Adaugă showTimeId aici

  let existingMovie;
  let existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }

  if (!existingMovie) {
    return res.status(404).json({ message: "Movie Not Found With Given ID" });
  }
  if (!user) {
    return res.status(404).json({ message: "User not found with given ID " });
  }
  let booking;

  try {
    booking = new Bookings({ // Asigură-te că folosești modelul corect
      movie,
      date: new Date(`${date}`),
      seatNumber,
      user,
      showTimeId, // Adaugă showTimeId aici
    });

    await booking.save();

    existingUser.bookings.push(booking);
    await existingUser.save();

    existingMovie.bookings.push(booking);
    await existingMovie.save();

  } catch (err) {
    console.log("Eroare la crearea rezervării:", err);
    return res.status(500).json({ message: "Eroare la crearea rezervării" });
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking });
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
