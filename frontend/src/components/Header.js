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
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/system";
import { getAllMovies } from "../api-helpers/api-helpers";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store";
import dramaLogo from "../assets/images/drama-logo.jpg";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsMenu from './Header/NotificationsMenu';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);
  const [value, setValue] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    getAllMovies(false)
      .then((data) => {
        setAllMovies(data.movies);
        const topMovies = data.movies
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 10);
        setFilteredMovies(topMovies);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    dispatch(authActions.logout());
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleSearchChange = (event, newInputValue) => {
    setSearchQuery(newInputValue);
    
    if (newInputValue.trim() === '') {
      const topMovies = allMovies
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 10);
      setFilteredMovies(topMovies);
    } else {
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
      navigate('/movies');
    }
    setSearchQuery("");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{
        '& .MuiDrawer-paper': {
          width: '80%',
          maxWidth: 300,
          backgroundColor: 'rgb(127, 29, 29)',
          color: 'white',
        },
      }}
    >
      <div className="p-4">
        <div className="mb-4">
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
                  width: '100%',
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
        <List>
          <ListItem button component={Link} to="/movies" onClick={toggleMobileMenu}>
            <ListItemText primary="Spectacole" />
          </ListItem>
          {!isLoggedIn ? (
            <ListItem button component={Link} to="/auth" onClick={toggleMobileMenu}>
              <ListItemText primary="Autentificare" />
            </ListItem>
          ) : (
            <>
              {userRole === "user" && (
                <ListItem button component={Link} to="/user" onClick={toggleMobileMenu}>
                  <ListItemText primary="Profil" />
                </ListItem>
              )}
              {userRole === "admin" && (
                <ListItem button component={Link} to="/admin" onClick={toggleMobileMenu}>
                  <ListItemText primary="Panou Admin" />
                </ListItem>
              )}
              <ListItem button onClick={logout}>
                <ListItemText primary="Deconectare" />
              </ListItem>
            </>
          )}
        </List>
      </div>
    </Drawer>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gradient-to-r from-red-900/95 to-purple-900/95 shadow-lg backdrop-blur-sm' 
        : 'bg-gradient-to-r from-red-900 to-purple-900'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={dramaLogo} alt="DramArena Logo" className="w-10 h-10 rounded-full" />
            <span className="text-white text-xl font-semibold hidden sm:inline">DramArena</span>
          </Link>

          {!isMobile && (
            <div className="flex-1 max-w-xl mx-4">
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
                      width: '100%',
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
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
          )}

          {!isMobile && (
            <div className="flex items-center space-x-4">
              <Link to="/movies" className="text-white hover:text-gray-200">
                Spectacole
              </Link>
              {!isLoggedIn && (
                <Link to="/auth" className="text-white hover:text-gray-200">
                  Autentificare
                </Link>
              )}
              {isLoggedIn && (
                <>
                  {userRole === "user" && (
                    <>
                      <NotificationsMenu />
                      <Link to="/user" className="text-white hover:text-gray-200">
                        Profil
                      </Link>
                    </>
                  )}
                  {userRole === "admin" && (
                    <Link to="/admin" className="text-white hover:text-gray-200">
                      Panou Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-white hover:text-gray-200"
                  >
                    Deconectare
                  </button>
                </>
              )}
            </div>
          )}

          {isMobile && (
            <div className="flex items-center space-x-2">
              {isLoggedIn && userRole === "user" && <NotificationsMenu />}
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileMenu}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
            </div>
          )}
        </div>
      </nav>
      {renderMobileMenu()}
    </header>
  );
};

export default Header;