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

movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/", addMovie);
movieRouter.put("/:id", updateMovie);
movieRouter.delete("/:id", deleteMovie);

// Rute pentru rating
movieRouter.post("/:movieId/rate", addRating);
movieRouter.get("/:movieId/rating", getUserRating);

export default movieRouter;
