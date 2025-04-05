import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../api-helpers/api-helpers";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Movies = () => {
  const [movies, setMovies] = useState();
  const [error, setError] = useState(null);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    console.log("Încercăm să încărcăm spectacolele...");
    getAllMovies()
      .then((data) => {
        console.log("Datele primite:", data);
        if (data && data.movies) {
          setMovies(data.movies);
        } else {
          console.error("Datele nu au formatul așteptat:", data);
          setError("Nu s-au putut încărcă spectacolele");
        }
      })
      .catch((err) => {
        console.error("Eroare la încărcarea spectacolelor:", err);
        setError("A apărut o eroare la încărcarea spectacolelor");
      });
  }, []);

  const filteredMovies = movies?.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center font-serif">
          {searchQuery ? `Rezultate pentru "${searchQuery}"` : "Toate spectacolele noastre"}
        </h2>
        {error && (
          <Typography color="error" textAlign="center" marginTop={2}>
            {error}
          </Typography>
        )}
        {filteredMovies?.length === 0 && (
          <Typography textAlign="center" color="text.secondary">
            Nu s-au găsit spectacole care să corespundă căutării.
          </Typography>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovies &&
            filteredMovies.map((movie) => (
              <div
                key={movie._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                  <p className="text-gray-600 mb-4">{movie.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-semibold">
                      {movie.pret} RON
                    </span>
                    {isUserLoggedIn ? (
                      <Link
                        to={`/booking/${movie._id}`}
                        className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors duration-300"
                      >
                        Rezervă
                      </Link>
                    ) : (
                      <Link
                        to="/auth"
                        className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors duration-300 group relative"
                      >
                        Rezervă
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-sm rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          Ups... E nevoie de autentificare pentru rezervarea biletului
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Movies;
