import express from "express";
import {
  deleteBooking,
  getBookingById,
  newBooking,
  getOccupiedSeats,
  getAllBookings
} from "../controllers/booking-controller.js";

const bookingsRouter = express.Router();

bookingsRouter.get("/all", getAllBookings);
bookingsRouter.get("/occupied-seats", getOccupiedSeats); 
bookingsRouter.get("/:id", getBookingById);
bookingsRouter.post("/", newBooking);
bookingsRouter.delete("/:id", deleteBooking);
export default bookingsRouter;
