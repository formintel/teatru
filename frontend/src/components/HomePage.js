// src/components/HomePage.js
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllMovies, deleteMovie } from "../api-helpers/api-helpers"; // Înlocuim getAllSpectacole cu getAllMovies
import dramaLogo from "../assets/images/drama-logo.jpg";
import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RatingComponent from './Movies/RatingComponent';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Map from './Map';

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
    navigate(`/movies/${movie._id}`);
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
      <div className="relative bg-gradient-to-r from-red-900 to-purple-900 h-[400px] sm:h-[500px] md:h-[600px]">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 overflow-hidden">
              <img
                src={dramaLogo}
                alt="DramArena Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-center font-serif">DramArena</h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-center max-w-2xl font-light px-4">
            Descoperă magia teatrului și rezervă-ți locul la cele mai bune spectacole
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/movies"
              className="bg-white text-red-900 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-red-50 transition-colors duration-300 transform hover:scale-105 text-center"
            >
              Vezi Spectacolele
            </Link>
            {isLoggedIn && userRole === "admin" && (
              <Link
                to="/user-admin" // Ajustăm ruta pentru a indica spre AdminProfile
                className="bg-yellow-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-yellow-600 transition-colors duration-300 transform hover:scale-105 text-center"
              >
                Panou Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center font-serif">
          Spectacole în Curs
        </h2>
        {spectacole.length === 0 ? (
          <p className="text-center text-gray-600">Nu există spectacole în curs momentan.</p>
        ) : (
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            centeredSlides={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
            initialSlide={0}
            watchSlidesProgress={true}
            preventInteractionOnTransition={true}
            observer={true}
            observeParents={true}
            resizeObserver={true}
          >
            {spectacole.map((spectacol) => (
              <SwiperSlide key={spectacol._id}>
                <div className="relative h-[400px] sm:h-[450px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={spectacol.posterUrl}
                    alt={spectacol.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{spectacol.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{spectacol.gen}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{spectacol.durata} min</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Sala {spectacol.sala}</span>
                    </div>
                    <div className="mb-2 sm:mb-3">
                      <RatingComponent
                        averageRating={spectacol.averageRating || 0}
                        totalRatings={spectacol.totalRatings || 0}
                        readOnly={true}
                      />
                    </div>
                    <p className="text-gray-200 text-sm mb-2">Regia: {spectacol.regizor}</p>
                    <p className="text-gray-300 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">{spectacol.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-semibold">
                        {spectacol.pret} RON
                      </span>
                      <Link
                        to={`/movies/${spectacol._id}`}
                        className="bg-red-900 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-800 transition-colors duration-300 text-sm sm:text-base"
                      >
                        Detalii
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎭</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 font-serif">Spectacole Diverse</h3>
              <p className="text-gray-600 text-sm sm:text-base">Alege dintr-o selecție variată de piese de teatru</p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💺</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 font-serif">Rezervare Ușoară</h3>
              <p className="text-gray-600 text-sm sm:text-base">Rezervă-ți locul în câteva click-uri simple</p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎫</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 font-serif">Bilete Digitale</h3>
              <p className="text-gray-600 text-sm sm:text-base">Primește biletele direct pe dispozitivul tău</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center font-serif">
            Cum ne găsești
          </h2>
          <div className="h-[300px] sm:h-[350px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;