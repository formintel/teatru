import express from "express";
import {
  addMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie
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

// Ruta pentru actualizare cu logging
movieRouter.put("/:id", (req, res, next) => {
  console.log(`Update movie route hit: ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  updateMovie(req, res, next);
});

// Ruta pentru ștergere cu logging
movieRouter.delete("/:id", (req, res, next) => {
  console.log(`Delete movie route hit: ${req.method} ${req.url}`);
  deleteMovie(req, res, next);
});

export default movieRouter;
