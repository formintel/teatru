import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";
import Booking from "../models/Bookings.js";
import { createNotificationForUsers } from "./notification-controller.js";

export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization?.split(" ")[1];
  if (!extractedToken) {
    return res.status(401).json({ message: "Token Not Found" });
  }

  let adminId;
  try {
    const decrypted = jwt.verify(extractedToken, process.env.JWT_SECRET);
    adminId = decrypted.id;
  } catch (err) {
    console.log("Token verification failed:", err);
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
  try {
    // Obținem toate filmele
    let movies = await Movie.find();
    const currentDate = new Date();

    // Filtrăm și procesăm fiecare film
    const filteredMovies = movies.map(movie => {
      // Convertim documentul Mongoose într-un obiect simplu pentru a-l putea modifica
      const movieObj = movie.toObject();

      // Filtrăm reprezentațiile care nu au expirat
      movieObj.showTimes = movieObj.showTimes.filter(showTime => {
        const showTimeDate = new Date(showTime.date);
        // Păstrăm doar reprezentațiile care sunt în viitor sau în ziua curentă
        return showTimeDate >= currentDate.setHours(0, 0, 0, 0);
      });

      return movieObj;
    }).filter(movie => 
      // Păstrăm doar filmele care au cel puțin o reprezentație viitoare
      movie.showTimes.length > 0
    );

    return res.status(200).json({ movies: filteredMovies });
  } catch (err) {
    console.error("Eroare la obținerea spectacolelor:", err);
    return res.status(500).json({ 
      message: "Eroare la obținerea spectacolelor", 
      error: err.message 
    });
  }
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  console.log("Încercăm să obținem filmul cu ID:", id);
  
  let movie;
  try {
    movie = await Movie.findById(id);
    console.log("Film găsit:", movie ? "Da" : "Nu");
  } catch (err) {
    console.error("Eroare la căutarea filmului:", err);
    return res.status(500).json({ message: "Eroare la căutarea filmului", error: err.message });
  }

  if (!movie) {
    console.error("Filmul nu a fost găsit cu ID:", id);
    return res.status(404).json({ message: "Filmul nu a fost găsit" });
  }

  // Verificăm dacă toate câmpurile necesare există
  const requiredFields = ['title', 'description', 'posterUrl', 'sala', 'numarLocuri', 'pret', 'regizor', 'durata', 'gen'];
  const missingFields = requiredFields.filter(field => !movie[field]);
  
  if (missingFields.length > 0) {
    console.error("Câmpuri lipsă în film:", missingFields);
    return res.status(500).json({ 
      message: "Date incomplete pentru film", 
      missingFields: missingFields 
    });
  }

  // Asigurăm că showTimes există și este un array
  if (!movie.showTimes || !Array.isArray(movie.showTimes)) {
    movie.showTimes = [];
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
    const decrypted = jwt.verify(extractedToken, process.env.JWT_SECRET);
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
    // Verificăm dacă există filmul și obținem showtime-urile vechi
    const existingMovie = await Movie.findById(id);
    if (!existingMovie) {
      return res.status(404).json({ message: "Spectacolul nu a fost găsit" });
    }

    console.log("Showtime-uri existente:", existingMovie.showTimes);
    console.log("Showtime-uri noi primite:", showTimes);

    // Identificăm showtime-urile care au fost șterse
    const oldShowTimeIds = existingMovie.showTimes.map(st => st._id.toString());
    const newShowTimeIds = showTimes.map(st => {
      // Handle both string IDs and ObjectIds
      if (st._id) {
        return typeof st._id === 'string' ? st._id : st._id.toString();
      }
      return null;
    }).filter(Boolean);

    console.log("ID-uri vechi:", oldShowTimeIds);
    console.log("ID-uri noi:", newShowTimeIds);

    const deletedShowTimeIds = oldShowTimeIds.filter(id => !newShowTimeIds.includes(id));
    console.log("ID-uri șterse:", deletedShowTimeIds);

    if (deletedShowTimeIds.length > 0) {
      console.log("Căutăm rezervări afectate pentru showtime-urile:", deletedShowTimeIds);
      
      // Găsim toate rezervările afectate
      const affectedBookings = await Booking.find({
        movie: id,
        showTimeId: { $in: deletedShowTimeIds }
      });

      console.log("Rezervări afectate găsite:", affectedBookings);

      if (affectedBookings.length > 0) {
        // Colectăm ID-urile unice ale utilizatorilor afectați
        const affectedUserIds = [...new Set(affectedBookings.map(booking => booking.user.toString()))];
        console.log("Utilizatori afectați:", affectedUserIds);

        // Creăm notificări pentru utilizatorii afectați
        const notificationResult = await createNotificationForUsers(
          affectedUserIds,
          "Reprezentație anulată",
          `O reprezentație pentru spectacolul "${existingMovie.title}" la care aveați bilet a fost anulată. Rezervarea dvs. a fost anulată automat.`,
          "warning"
        );
        console.log("Rezultat creare notificări:", notificationResult);

        // Ștergem rezervările afectate
        const deleteResult = await Booking.deleteMany({
          movie: id,
          showTimeId: { $in: deletedShowTimeIds }
        });
        console.log("Rezultat ștergere rezervări:", deleteResult);
      }
    }

    // Procesăm showtime-urile noi pentru a ne asigura că au formatul corect
    const processedShowTimes = showTimes.map(st => ({
      _id: st._id || new mongoose.Types.ObjectId(),
      date: new Date(st.date),
      availableSeats: st.availableSeats
    }));

    // Actualizăm filmul cu noile date
    const movie = await Movie.findByIdAndUpdate(id, {
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
      showTimes: processedShowTimes
    }, { new: true });

    console.log("Film actualizat:", movie);
    return res.status(200).json({ movie });
  } catch (err) {
    console.error("Error updating movie:", err);
    return res.status(500).json({ message: "Eroare la actualizarea spectacolului", error: err.message });
  }
};

export const deleteMovie = async (req, res) => {
  const id = req.params.id;
  
  try {
    // Găsim toate rezervările pentru acest spectacol
    const bookings = await Booking.find({ movie: id });
    const affectedUserIds = [...new Set(bookings.map(booking => booking.user))];
    
    // Ștergem toate rezervările pentru acest spectacol
    await Booking.deleteMany({ movie: id });
    
    // Găsim spectacolul pentru a-i obține titlul
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Spectacolul nu a fost găsit" });
    }
    
    // Creăm notificări pentru toți utilizatorii afectați
    if (affectedUserIds.length > 0) {
      await createNotificationForUsers(
        affectedUserIds,
        "Spectacol anulat",
        `Spectacolul "${movie.title}" a fost anulat. Rezervările dvs. au fost anulate automat.`,
        "warning"
      );
    }
    
    // Ștergem spectacolul
    await Movie.findByIdAndDelete(id);
    
    return res.status(200).json({ message: "Spectacol șters cu succes" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Eroare la ștergerea spectacolului" });
  }
};

export const addRating = async (req, res, next) => {
  console.log("addRating called with params:", req.params);
  console.log("Request body:", req.body);
  console.log("Full URL:", req.originalUrl);

  const { movieId } = req.params;
  const { userId, rating } = req.body;

  if (!movieId || !userId || !rating) {
    console.log("Missing required fields:", { movieId, userId, rating });
    return res.status(400).json({ 
      message: "Date lipsă", 
      received: { movieId, userId, rating }
    });
  }

  try {
    console.log("Searching for movie with ID:", movieId);
    const movie = await Movie.findById(movieId);
    if (!movie) {
      console.log("Movie not found with ID:", movieId);
      return res.status(404).json({ message: "Spectacolul nu a fost găsit" });
    }

    console.log("Found movie:", movie.title);

    // Verifică dacă utilizatorul a dat deja un rating
    const existingRatingIndex = movie.ratings.findIndex(r => r.userId.toString() === userId);
    
    if (existingRatingIndex !== -1) {
      console.log("Updating existing rating");
      // Actualizează rating-ul existent
      movie.ratings[existingRatingIndex].value = rating;
      movie.ratings[existingRatingIndex].createdAt = new Date();
    } else {
      console.log("Adding new rating");
      // Adaugă un nou rating
      movie.ratings.push({
        userId,
        value: rating,
        createdAt: new Date()
      });
    }

    await movie.save();
    console.log("Movie saved successfully");

    res.status(200).json({
      message: "Rating adăugat cu succes",
      averageRating: movie.averageRating,
      totalRatings: movie.totalRatings
    });
  } catch (err) {
    console.error("Error in addRating:", err);
    return res.status(500).json({ 
      message: "Eroare la adăugarea rating-ului",
      error: err.message 
    });
  }
};

export const getUserRating = async (req, res, next) => {
  console.log("getUserRating called with params:", req.params);
  console.log("Query params:", req.query);
  console.log("Full URL:", req.originalUrl);

  const { movieId } = req.params;
  const { userId } = req.query;

  if (!movieId || !userId) {
    console.log("Missing required fields:", { movieId, userId });
    return res.status(400).json({ 
      message: "Date lipsă",
      received: { movieId, userId }
    });
  }

  try {
    console.log("Searching for movie with ID:", movieId);
    const movie = await Movie.findById(movieId);
    if (!movie) {
      console.log("Movie not found with ID:", movieId);
      return res.status(404).json({ message: "Spectacolul nu a fost găsit" });
    }

    console.log("Found movie:", movie.title);
    const userRating = movie.ratings.find(r => r.userId.toString() === userId);
    console.log("User rating found:", userRating);
    
    res.status(200).json({
      rating: userRating ? userRating.value : 0
    });
  } catch (err) {
    console.error("Error in getUserRating:", err);
    return res.status(500).json({ 
      message: "Eroare la obținerea rating-ului",
      error: err.message 
    });
  }
};
