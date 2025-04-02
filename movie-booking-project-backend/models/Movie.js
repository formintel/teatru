import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actors: [{ type: String, required: true }],
  releaseDate: {
    type: Date,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
  },
  sala: {
    type: String,
    required: true,
  },
  numarLocuri: {
    type: Number,
    required: true,
  },
  pret: {
    type: Number,
    required: true,
  },
  regizor: {
    type: String,
    required: true,
  },
  durata: {
    type: Number,
    required: true,
  },
  gen: {
    type: String,
    required: true,
  },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model("Movie", movieSchema);
