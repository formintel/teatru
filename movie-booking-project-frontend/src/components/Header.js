// src/components/Header.js
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Toolbar,
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import { Box } from "@mui/system";
import { getAllMovies } from "../api-helpers/api-helpers";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store";
import dramaLogo from "../assets/images/drama-logo.jpg";
import SearchIcon from "@mui/icons-material/Search";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);
  const [value, setValue] = useState(null); // Setăm valoarea inițială ca null
  const [allMovies, setAllMovies] = useState([]); // Stocăm toate spectacolele
  const [filteredMovies, setFilteredMovies] = useState([]); // Spectacolele filtrate pentru afișare
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    getAllMovies()
      .then((data) => {
        setAllMovies(data.movies);
        // Inițial afișăm top 10 spectacole după rating
        const topMovies = data.movies
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 10);
        setFilteredMovies(topMovies);
      })
      .catch((err) => console.log(err));
  }, []);

  const logout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  const handleSearchChange = (event, newInputValue) => {
    setSearchQuery(newInputValue);
    
    if (newInputValue.trim() === '') {
      // Dacă nu există text de căutare, afișăm top 10
      const topMovies = allMovies
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 10);
      setFilteredMovies(topMovies);
    } else {
      // Dacă există text de căutare, căutăm în toate spectacolele
      const searchResults = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(newInputValue.toLowerCase()) ||
        movie.description.toLowerCase().includes(newInputValue.toLowerCase()) ||
        movie.gen.toLowerCase().includes(newInputValue.toLowerCase()) ||
        movie.regizor.toLowerCase().includes(newInputValue.toLowerCase())
      );
      setFilteredMovies(searchResults);
    }
  };

  const handleMovieSelect = (event, value) => {
    if (value) {
      navigate(`/movies/${value._id}`);
    } else {
      // Când se face click pe butonul de spectacole, se încarcă toate spectacolele
      navigate('/movies');
    }
    setSearchQuery("");
  };

  return (
    <header className="bg-gradient-to-r from-red-900 to-purple-900 shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={dramaLogo}
                alt="DramArena Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-2xl font-bold text-white hover:text-red-200 transition-colors duration-300 font-serif">
              DramArena
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <Autocomplete
                value={value}
                onChange={handleMovieSelect}
                inputValue={searchQuery}
                onInputChange={handleSearchChange}
                options={filteredMovies}
                getOptionLabel={(option) => `${option.title} (Rating: ${option.averageRating?.toFixed(1) || '0.0'})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Caută spectacole..."
                    size="small"
                    sx={{
                      width: 300,
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                  />
                )}
                sx={{
                  "& .MuiAutocomplete-popupIndicator": {
                    color: "white",
                  },
                  "& .MuiAutocomplete-clearIndicator": {
                    color: "white",
                  },
                }}
              />
            </div>

            <Link to="/movies" className="text-white hover:text-red-200 transition-colors duration-300">
              Spectacole
            </Link>

            {!isLoggedIn && (
              <>
                <Link
                  to="/admin-login"
                  className="text-white hover:text-red-200 transition-colors duration-300 text-sm opacity-70 hover:opacity-100"
                >
                  Admin
                </Link>
                <Link to="/auth" className="text-white hover:text-red-200 transition-colors duration-300">
                  Autentificare
                </Link>
              </>
            )}

            {isLoggedIn && userRole === "user" && (
              <>
                <Link to="/user" className="text-white hover:text-red-200 transition-colors duration-300">
                  Profil
                </Link>
                <button
                  onClick={logout}
                  className="bg-white text-red-900 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-300 transform hover:scale-105"
                >
                  Deconectare
                </button>
              </>
            )}

            {isLoggedIn && userRole === "admin" && (
              <>
                <Link to="/user-admin" className="text-white hover:text-red-200 transition-colors duration-300">
                  Panou Admin
                </Link>
                <Link to="/add" className="text-white hover:text-red-200 transition-colors duration-300">
                  Adaugă Spectacol
                </Link>
                <button
                  onClick={logout}
                  className="bg-white text-red-900 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-300 transform hover:scale-105"
                >
                  Deconectare
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;