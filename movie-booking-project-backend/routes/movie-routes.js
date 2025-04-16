import express from "express";
import {
  addMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  addRating,
  getUserRating
} from "../controllers/movie-controller.js";

const movieRouter = express.Router();

// Logging middleware pentru rutele de film
movieRouter.use((req, res, next) => {
  console.log(`Movie route accessed: ${req.method} ${req.url}`);
  next();
});

movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/", addMovie);
movieRouter.put("/:id", updateMovie);
movieRouter.delete("/:id", deleteMovie);

// Rute pentru rating
movieRouter.post("/:movieId/rate", addRating);
movieRouter.get("/:movieId/rating", getUserRating);

export default movieRouter;
