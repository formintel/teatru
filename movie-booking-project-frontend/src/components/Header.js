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
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const logout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
      setValue(null); // Resetăm valoarea selectată
    }
  };

  const handleMovieSelect = (event, newValue) => {
    if (newValue) {
      navigate(`/movies?search=${encodeURIComponent(newValue.title)}`);
      setSearchQuery("");
      setValue(null); // Resetăm valoarea selectată
    }
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
                onInputChange={(event, newInputValue) => {
                  setSearchQuery(newInputValue);
                }}
                options={movies}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Caută spectacole..."
                    size="small"
                    sx={{
                      width: 250,
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