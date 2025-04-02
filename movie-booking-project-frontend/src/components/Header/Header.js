import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../helpers/api-helpers";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/user-slice";
import { adminActions } from "../../store/admin-slice";
import { Menu, Search, X, Film } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllMovies()
      .then((data) => {
        setMovies(data);
        setFilteredMovies(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [searchQuery, movies]);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie.title);
    setShowSearch(false);
    if (isUserLoggedIn) {
      navigate(`/booking/${movie._id}`);
    }
  };

  const handleLogout = () => {
    if (isUserLoggedIn) {
      dispatch(userActions.logout());
    } else if (isAdminLoggedIn) {
      dispatch(adminActions.logout());
    }
    navigate("/");
    setShowMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-800 to-purple-900 shadow-lg">
      {/* Desktop Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Film className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">MovieMagic</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search bar */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full text-gray-200 hover:bg-purple-700 focus:outline-none"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {showSearch && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20">
                  <div className="p-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies..."
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  {filteredMovies.length > 0 && (
                    <ul className="max-h-60 overflow-auto">
                      {filteredMovies.map((movie) => (
                        <li
                          key={movie._id}
                          onClick={() => handleMovieSelect(movie)}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 cursor-pointer"
                        >
                          {movie.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            {/* Navigation tabs */}
            <div className="flex space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 0 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
                onClick={() => setActiveTab(0)}
              >
                Home
              </Link>
              
              <Link 
                to="/movies" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 1 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
                onClick={() => setActiveTab(1)}
              >
                Movies
              </Link>
              
              {!isAdminLoggedIn && !isUserLoggedIn && (
                <>
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 2 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
                    onClick={() => setActiveTab(2)}
                  >
                    Admin
                  </Link>
                  
                  <Link 
                    to="/auth" 
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 3 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
                    onClick={() => setActiveTab(3)}
                  >
                    Auth
                  </Link>
                </>
              )}
              
              {isUserLoggedIn && (
                <Link 
                  to="/user" 
                  className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 4 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
                  onClick={() => setActiveTab(4)}
                >
                  Profile
                </Link>
              )}
              
              {isAdminLoggedIn && (
                <Link 
                  to="/add" 
                  className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 5 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
                  onClick={() => setActiveTab(5)}
                >
                  Add Movie
                </Link>
              )}
              
              {(isUserLoggedIn || isAdminLoggedIn) && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-gray-200 rounded-md hover:bg-purple-700 hover:text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full text-gray-200 hover:bg-purple-700 focus:outline-none mr-2"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full text-gray-200 hover:bg-purple-700 focus:outline-none"
            >
              {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {showMenu && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 text-base font-medium rounded-md ${activeTab === 0 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
              onClick={() => {
                setActiveTab(0);
                setShowMenu(false);
              }}
            >
              Home
            </Link>
            
            <Link 
              to="/movies" 
              className={`block px-3 py-2 text-base font-medium rounded-md ${activeTab === 1 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
              onClick={() => {
                setActiveTab(1);
                setShowMenu(false);
              }}
            >
              Movies
            </Link>
            
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Link 
                  to="/admin" 
                  className={`block px-3 py-2 text-base font-medium rounded-md ${activeTab === 2 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
                  onClick={() => {
                    setActiveTab(2);
                    setShowMenu(false);
                  }}
                >
                  Admin
                </Link>
                
                <Link 
                  to="/auth" 
                  className={`block px-3 py-2 text-base font-medium rounded-md ${activeTab === 3 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
                  onClick={() => {
                    setActiveTab(3);
                    setShowMenu(false);
                  }}
                >
                  Auth
                </Link>
              </>
            )}
            
            {isUserLoggedIn && (
              <Link 
                to="/user" 
                className={`block px-3 py-2 text-base font-medium rounded-md ${activeTab === 4 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
                onClick={() => {
                  setActiveTab(4);
                  setShowMenu(false);
                }}
              >
                Profile
              </Link>
            )}
            
            {isAdminLoggedIn && (
              <Link 
                to="/add" 
                className={`block px-3 py-2 text-base font-medium rounded-md ${activeTab === 5 ? 'text-white bg-purple-700' : 'text-gray-200 hover:bg-purple-700 hover:text-white'}`}
                onClick={() => {
                  setActiveTab(5);
                  setShowMenu(false);
                }}
              >
                Add Movie
              </Link>
            )}
            
            {(isUserLoggedIn || isAdminLoggedIn) && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-200 rounded-md hover:bg-purple-700 hover:text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {filteredMovies.length > 0 && searchQuery && (
              <ul className="absolute left-0 right-0 bg-white rounded-md shadow-lg mt-1 max-h-60 overflow-auto z-20">
                {filteredMovies.map((movie) => (
                  <li
                    key={movie._id}
                    onClick={() => handleMovieSelect(movie)}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 cursor-pointer"
                  >
                    {movie.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;