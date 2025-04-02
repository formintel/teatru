import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllMovies } from "../api-helpers/api-helpers";
import dramaLogo from "../assets/images/drama-logo.jpg";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const HomePage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getAllMovies()
      .then((data) => {
        console.log("Datele primite:", data.movies); // Pentru debugging
        setMovies(data.movies);
      })
      .catch((err) => console.log(err));
  }, []);

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
          <Link 
            to="/movies" 
            className="bg-white text-red-900 px-8 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors duration-300 transform hover:scale-105"
          >
            Vezi Spectacolele
          </Link>
        </div>
      </div>

      {/* Featured Shows Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center font-serif">Spectacole în Curs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.slice(0, 6).map((movie) => {
            const formattedDate = format(new Date(movie.releaseDate), "d MMMM yyyy", { locale: ro });
            return (
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 font-serif">{movie.title}</h3>
                  <p className="text-gray-600 mb-4">{movie.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-red-900 font-semibold">{formattedDate}</span>
                    <span className="text-green-600 font-semibold">{movie.pret} RON</span>
                  </div>
                  <Link 
                    to={`/booking/${movie._id}`}
                    className="inline-block bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors duration-300 w-full text-center"
                  >
                    Rezervă Bilet
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
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
