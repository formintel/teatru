import mongoose from "mongoose";
import Movie from "../models/Movie.js"; // Asigură-te că calea la modelul Movie este corectă

const MONGO_URI = "mongodb://localhost:27017/proiectulMeu"; // Schimbă cu baza ta reală

const addShowTimeIds = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB ✅");

    // Găsim toate filmele care au showtimes fără _id
    const movies = await Movie.find({ "showTimes._id": { $exists: false } });

    console.log(`Found ${movies.length} movies with showTimes without _id`);

    // Actualizăm fiecare film
    for (const movie of movies) {
      console.log(`Processing movie: ${movie.title}`);

      // Adăugăm un _id fiecărui showTime fără _id
      await Movie.updateOne(
        { _id: movie._id },
        {
          $set: {
            "showTimes.$[elem]._id": new mongoose.Types.ObjectId(),
          },
        },
        {
          arrayFilters: [{ "elem._id": { $exists: false } }],
        }
      );

      console.log(`Updated showTimes for movie: ${movie.title}`);
    }

    console.log("Modificările au fost aplicate cu succes ✅");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error during migration ❌", error);
    mongoose.disconnect();
  }
};

addShowTimeIds();
