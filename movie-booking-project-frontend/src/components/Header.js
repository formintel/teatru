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
import { adminActions, userActions } from "../store";
import dramaLogo from "../assets/images/drama-logo.jpg";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [value, setValue] = useState();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const logout = () => {
    dispatch(adminActions.logout());
    dispatch(userActions.logout());
    navigate("/");
  };

  const handleChange = (e, val) => {
    const movie = movies.find((m) => m.title === val);
    console.log(movie);
    if (isUserLoggedIn) {
      navigate(`/booking/${movie._id}`);
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
            <Link to="/movies" className="text-white hover:text-red-200 transition-colors duration-300">
              Spectacole
            </Link>
            
            {!isUserLoggedIn && !isAdminLoggedIn && (
              <>
                <Link to="/admin" className="text-white hover:text-red-200 transition-colors duration-300">
                  Admin
                </Link>
                <Link to="/auth" className="text-white hover:text-red-200 transition-colors duration-300">
                  Autentificare
                </Link>
              </>
            )}
            
            {isUserLoggedIn && !isAdminLoggedIn && (
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
            
            {isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Link to="/add" className="text-white hover:text-red-200 transition-colors duration-300">
                  Adaugă Spectacol
                </Link>
                <Link to="/user-admin" className="text-white hover:text-red-200 transition-colors duration-300">
                  Profil Admin
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
