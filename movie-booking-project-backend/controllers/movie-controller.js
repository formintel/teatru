import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";
export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    return res.status(401).json({ message: "Token Not Found" });
  }

  let adminId;
  try {
    const decrypted = jwt.verify(extractedToken, process.env.SECRET_KEY);
    adminId = decrypted.id;
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  //create new movie
  const { 
    title, 
    description, 
    releaseDate, 
    posterUrl, 
    featured, 
    actors, 
    showTimes,
    sala,
    numarLocuri,
    pret,
    regizor,
    durata,
    gen
  } = req.body;

  console.log("Date primite în backend:", {
    title,
    description,
    releaseDate,
    posterUrl,
    featured,
    actors,
    showTimes,
    sala,
    numarLocuri,
    pret,
    regizor,
    durata,
    gen
  });

  // Validare câmpuri obligatorii
  if (!title || !description || !posterUrl || !sala || !numarLocuri || !pret || !regizor || !durata || !gen) {
    console.log("Câmpuri lipsă:", {
      title: !title,
      description: !description,
      posterUrl: !posterUrl,
      sala: !sala,
      numarLocuri: !numarLocuri,
      pret: !pret,
      regizor: !regizor,
      durata: !durata,
      gen: !gen
    });
    return res.status(422).json({ message: "Toate câmpurile sunt obligatorii" });
  }

  let movie;
  try {
    // Verifică dacă adminul există
    const adminUser = await Admin.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Creează și salvează filmul
    movie = new Movie({
      title,
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured: featured || false,
      actors: actors || [],
      admin: adminId,
      posterUrl,
      sala,
      numarLocuri: Number(numarLocuri),
      pret: Number(pret),
      regizor,
      durata: Number(durata),
      gen,
      showTimes: showTimes || []
    });

    console.log("Obiectul Movie creat:", movie);

    // Salvează filmul
    await movie.save();

    // Adaugă filmul la lista adminului
    adminUser.addedMovies.push(movie);
    await adminUser.save();

    return res.status(201).json({ movie });
  } catch (err) {
    console.error("Error adding movie:", err);
    return res.status(500).json({ message: "Eroare la adăugarea spectacolului", error: err.message });
  }
};

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }

  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};

export const updateMovie = async (req, res, next) => {
  console.log("updateMovie controller function called");
  console.log("Request params:", req.params);
  console.log("Request body:", req.body);

  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    console.log("No token found");
    return res.status(401).json({ message: "Token Not Found" });
  }

  let adminId;
  try {
    const decrypted = jwt.verify(extractedToken, process.env.SECRET_KEY);
    adminId = decrypted.id;
    console.log("Admin ID from token:", adminId);
  } catch (err) {
    console.log("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid Token" });
  }

  const id = req.params.id;
  const {
    title,
    description,
    posterUrl,
    pret,
    gen,
    regizor,
    durata,
    sala,
    numarLocuri,
    actors,
    showTimes
  } = req.body;

  console.log("Updating movie with ID:", id);
  console.log("Update data:", {
    title,
    description,
    posterUrl,
    pret,
    gen,
    regizor,
    durata,
    sala,
    numarLocuri,
    actors,
    showTimes
  });

  // Validare câmpuri obligatorii
  if (!title || !description || !posterUrl || !sala || !numarLocuri || !pret || !regizor || !durata || !gen) {
    return res.status(422).json({ message: "Toate câmpurile sunt obligatorii" });
  }

  try {
    // Verifică dacă filmul există și aparține adminului
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Filmul nu a fost găsit" });
    }

    if (movie.admin.toString() !== adminId) {
      return res.status(403).json({ message: "Nu ai permisiunea de a actualiza acest film" });
    }

    // Pregătim datele pentru actualizare
    const updateData = {
      title,
      description,
      posterUrl,
      pret: Number(pret),
      gen,
      regizor,
      durata: Number(durata),
      sala,
      numarLocuri: Number(numarLocuri),
      actors: actors || [],
      showTimes: showTimes.map(showTime => {
        console.log("Processing showTime:", showTime);
        return {
          _id: showTime._id,
          date: new Date(showTime.date),
          availableSeats: showTime.availableSeats || Number(numarLocuri)
        };
      })
    };

    console.log("Final update data:", updateData);

    // Actualizează filmul
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    console.log("Updated movie from database:", updatedMovie);

    return res.status(200).json({ movie: updatedMovie });
  } catch (err) {
    console.error("Error updating movie:", err);
    return res.status(500).json({ message: "Eroare la actualizarea spectacolului", error: err.message });
  }
};

export const deleteMovie = async (req, res, next) => {
  console.log("deleteMovie controller function called");
  console.log("Request params:", req.params);

  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    console.log("No token found");
    return res.status(401).json({ message: "Token Not Found" });
  }

  let adminId;
  try {
    const decrypted = jwt.verify(extractedToken, process.env.SECRET_KEY);
    adminId = decrypted.id;
    console.log("Admin ID from token:", adminId);
  } catch (err) {
    console.log("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid Token" });
  }

  const id = req.params.id;

  try {
    // Verifică dacă filmul există și aparține adminului
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Filmul nu a fost găsit" });
    }

    if (movie.admin.toString() !== adminId) {
      return res.status(403).json({ message: "Nu ai permisiunea de a șterge acest film" });
    }

    // Șterge filmul
    await Movie.findByIdAndDelete(id);

    // Actualizează lista de filme a adminului
    const adminUser = await Admin.findById(adminId);
    if (adminUser) {
      adminUser.addedMovies = adminUser.addedMovies.filter(
        movieId => movieId.toString() !== id
      );
      await adminUser.save();
    }

    return res.status(200).json({ message: "Film șters cu succes" });
  } catch (err) {
    console.error("Error deleting movie:", err);
    return res.status(500).json({ message: "Eroare la ștergerea spectacolului", error: err.message });
  }
};
