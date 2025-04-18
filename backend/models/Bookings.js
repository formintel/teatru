import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  showTimeId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
}, {
  timestamps: true
});

// Adăugăm un index compus pentru a preveni duplicate
bookingSchema.index({ movie: 1, showTimeId: 1, seatNumber: 1 }, { unique: true });

export default mongoose.model("Booking", bookingSchema);
