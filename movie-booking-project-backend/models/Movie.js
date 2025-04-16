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
  actors: [{ type: String }],
  releaseDate: {
    type: Date,
    required: true,
  },
  showTimes: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      date: { type: Date, required: true },
      availableSeats: { type: Number, required: true }
    }
  ],
  ratings: [{
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    value: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
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

// Middleware pentru a asigura că averageRating și totalRatings sunt actualizate
movieSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const totalValue = this.ratings.reduce((sum, rating) => sum + rating.value, 0);
    this.averageRating = totalValue / this.ratings.length;
    this.totalRatings = this.ratings.length;
  } else {
    this.averageRating = 0;
    this.totalRatings = 0;
  }
  next();
});

export default mongoose.model("Movie", movieSchema);
