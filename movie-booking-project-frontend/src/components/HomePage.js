// src/components/HomePage.js
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllMovies, deleteMovie } from "../api-helpers/api-helpers"; // Înlocuim getAllSpectacole cu getAllMovies
import dramaLogo from "../assets/images/drama-logo.jpg";
import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const HomePage = () => {
  const [spectacole, setSpectacole] = useState([]);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  useEffect(() => {
    getAllMovies(true) // Folosim getAllMovies în loc de getAllSpectacole
      .then((data) => {
        console.log("Spectacole în curs:", data.movies);
        setSpectacole(data.movies);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleOpen = (movie) => {
    navigate(`/admin/movies/${movie._id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest spectacol?")) {
      try {
        await deleteMovie(id);
        // Reîmprospătăm lista de spectacole
        const updatedMovies = await getAllMovies(true);
        setSpectacole(updatedMovies.movies);
      } catch (err) {
        console.error("Eroare la ștergerea spectacolului:", err);
        alert("A apărut o eroare la ștergerea spectacolului");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-900 to-purple-900 h-[600px]">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <div className="mb-8">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
              <img
                src={dramaLogo}
                alt="DramArena Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-6xl font-bold mb-6 text-center font-serif">DramArena</h1>
          </div>
          <p className="text-2xl mb-8 text-center max-w-2xl font-light">
            Descoperă magia teatrului și rezervă-ți locul la cele mai bune spectacole
          </p>
          <div className="flex gap-4">
            <Link
              to="/movies"
              className="bg-white text-red-900 px-8 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors duration-300 transform hover:scale-105"
            >
              Vezi Spectacolele
            </Link>
            {isLoggedIn && userRole === "admin" && (
              <Link
                to="/user-admin" // Ajustăm ruta pentru a indica spre AdminProfile
                className="bg-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-600 transition-colors duration-300 transform hover:scale-105"
              >
                Panou Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Featured Shows Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center font-serif">
          Spectacole în Curs
        </h2>
        {spectacole.length === 0 ? (
          <p className="text-center text-gray-600">Nu există spectacole în curs momentan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spectacole.map((spectacol) => (
              <div
                key={spectacol._id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 cursor-pointer group relative ${
                  userRole === "admin" ? "opacity-75" : "hover:scale-105"
                }`}
              >
                <div 
                  className="relative cursor-pointer"
                  onClick={() => {
                    if (userRole === "admin") {
                      handleOpen(spectacol);
                    } else {
                      navigate(`/movies/${spectacol._id}`);
                    }
                  }}
                >
                  <img
                    src={spectacol.posterUrl}
                    alt={spectacol.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{spectacol.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{spectacol.gen}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{spectacol.durata} min</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Sala {spectacol.sala}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">Regia: {spectacol.regizor}</p>
                    <p className="text-gray-600 mb-4 line-clamp-3">{spectacol.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">
                        {spectacol.pret} RON
                      </span>
                      {isLoggedIn && userRole === "user" ? (
                        <Link
                          to={`/booking/${spectacol._id}`}
                          className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Rezervă
                        </Link>
                      ) : isLoggedIn && userRole === "admin" ? (
                        <span className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed">
                          Detalii
                        </span>
                      ) : (
                        <span className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed">
                          Autentifică-te pentru a rezerva
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isLoggedIn && userRole === "admin" && (
                  <div className="flex justify-between mt-4 px-6">
                    <IconButton onClick={() => handleOpen(spectacol)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(spectacol._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold mb-2 font-serif">Spectacole Diverse</h3>
              <p className="text-gray-600">Alege dintr-o selecție variată de piese de teatru</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💺</div>
              <h3 className="text-xl font-semibold mb-2 font-serif">Rezervare Ușoară</h3>
              <p className="text-gray-600">Rezervă-ți locul în câteva click-uri simple</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold mb-2 font-serif">Bilete Digitale</h3>
              <p className="text-gray-600">Primește biletele direct pe dispozitivul tău</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;