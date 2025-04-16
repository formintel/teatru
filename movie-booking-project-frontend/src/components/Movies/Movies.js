// src/components/Movies/Movies.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { getAllMovies, updateMovie, deleteMovie } from "../../api-helpers/api-helpers";
import { Typography, Modal, TextField, Button, IconButton, Box, FormControl, InputLabel, Select, MenuItem, Slider, Chip, ToggleButton, ToggleButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RatingComponent from "./RatingComponent";
import SortIcon from "@mui/icons-material/Sort";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "800px",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflowY: "auto",
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    gen: "",
    durata: [0, 300],
    pret: [0, 200],
    sala: "",
  });
  const [currentMovie, setCurrentMovie] = useState({
    _id: "",
    title: "",
    description: "",
    posterUrl: "",
    pret: "",
    gen: "",
    regizor: "",
    durata: "",
    sala: "",
    numarLocuri: "",
    showTimes: [{ _id: "", date: "", availableSeats: "" }],
  });
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [sortOrder, setSortOrder] = useState('rating'); // 'rating', 'price-asc', 'price-desc'

  useEffect(() => {
    console.log("Încercăm să încărcăm spectacolele...");
    getAllMovies()
      .then((data) => {
        console.log("Datele primite:", data);
        if (data && data.movies) {
          setMovies(data.movies);
        } else {
          console.error("Datele nu au formatul așteptat:", data);
          setError("Nu s-au putut încărca spectacolele");
        }
      })
      .catch((err) => {
        console.error("Eroare la încărcarea spectacolelor:", err);
        setError("A apărut o eroare la încărcarea spectacolelor");
      });
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      gen: "",
      durata: [0, 300],
      pret: [0, 200],
      sala: "",
    });
  };

  const filteredMovies = movies
    ?.filter((movie) => {
      const matchesSearch = 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.gen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.regizor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGen = !filters.gen || movie.gen === filters.gen;
      const matchesDurata = 
        movie.durata >= filters.durata[0] && 
        movie.durata <= filters.durata[1];
      const matchesPret = 
        movie.pret >= filters.pret[0] && 
        movie.pret <= filters.pret[1];
      const matchesSala = !filters.sala || movie.sala === filters.sala;

      return matchesSearch && matchesGen && matchesDurata && matchesPret && matchesSala;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'price-asc':
          return a.pret - b.pret;
        case 'price-desc':
          return b.pret - a.pret;
        default:
          return 0;
      }
    });

  const handleOpen = (movie) => {
    console.log("handleOpen apelat pentru filmul:", movie);
    setCurrentMovie({
      ...movie,
      showTimes: movie.showTimes?.map(st => {
        // Convertim data în formatul corect pentru input
        const date = st.date ? new Date(st.date).toISOString().slice(0, 16) : "";
        console.log("Data procesată în handleOpen:", date);
        
        return {
          _id: st._id,
          date: date,
          availableSeats: st.availableSeats || movie.numarLocuri
        };
      }) || [{ _id: "", date: "", availableSeats: movie.numarLocuri }]
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowTimeChange = (e, index) => {
    const newShowTimes = [...currentMovie.showTimes];
    newShowTimes[index].dateTime = e.target.value;
    setCurrentMovie((prev) => ({ ...prev, showTimes: newShowTimes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit apelat");
    console.log("currentMovie:", currentMovie);
    
    try {
      // Formatăm datele pentru a se potrivi cu modelul backend
      const updatedMovie = {
        ...currentMovie,
        showTimes: currentMovie.showTimes.map(showTime => {
          // Convertim data în format ISO și adăugăm timezone
          const date = showTime.date ? new Date(showTime.date + ":00.000Z") : new Date();
          console.log("Data procesată în handleSubmit:", date);
          
          return {
            _id: showTime._id,
            date: date.toISOString(), // Convertim data în format ISO
            availableSeats: showTime.availableSeats || currentMovie.numarLocuri
          };
        })
      };
      
      console.log("Date trimise către updateMovie:", updatedMovie);
      
      // Apelăm funcția de actualizare
      const response = await updateMovie(currentMovie._id, updatedMovie);
      console.log("Răspuns la actualizare:", response);

      // Reîmprospătăm lista de spectacole
      const updatedMovies = await getAllMovies();
      console.log("Lista actualizată de spectacole:", updatedMovies);
      
      if (updatedMovies && updatedMovies.movies) {
        setMovies(updatedMovies.movies);
      }

      // Închidem modalul
      handleClose();
    } catch (err) {
      console.error("Eroare în handleSubmit:", err);
      setError("A apărut o eroare la actualizarea spectacolului");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ești sigur că vrei să ștergi acest spectacol?")) {
      try {
        await deleteMovie(id);
        const updatedMovies = await getAllMovies();
        setMovies(updatedMovies.movies);
      } catch (err) {
        console.error("Eroare la ștergerea spectacolului:", err);
        setError("A apărut o eroare la ștergerea spectacolului");
      }
    }
  };
  
  // Obținem toate genurile unice pentru filtru
  const uniqueGenres = [...new Set(movies.map(movie => movie.gen))];
  const uniqueSali = [...new Set(movies.map(movie => movie.sala))];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center font-serif">
          {searchQuery ? `Rezultate pentru "${searchQuery}"` : "Toate spectacolele noastre"}
        </h2>

        {/* Filtre și Sortare */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Filtru Gen */}
            <FormControl fullWidth>
              <InputLabel>Gen</InputLabel>
              <Select
                value={filters.gen}
                onChange={(e) => handleFilterChange('gen', e.target.value)}
                label="Gen"
              >
                <MenuItem value="">Toate genurile</MenuItem>
                {uniqueGenres.map((gen) => (
                  <MenuItem key={gen} value={gen}>{gen}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtru Sala */}
            <FormControl fullWidth>
              <InputLabel>Sala</InputLabel>
              <Select
                value={filters.sala}
                onChange={(e) => handleFilterChange('sala', e.target.value)}
                label="Sala"
              >
                <MenuItem value="">Toate sălile</MenuItem>
                {uniqueSali.map((sala) => (
                  <MenuItem key={sala} value={sala}>Sala {sala}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtru Durată */}
            <div>
              <Typography gutterBottom>Durata (minute)</Typography>
              <Slider
                value={filters.durata}
                onChange={(_, newValue) => handleFilterChange('durata', newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={300}
                step={10}
              />
            </div>

            {/* Filtru Preț */}
            <div>
              <Typography gutterBottom>Preț (RON)</Typography>
              <Slider
                value={filters.pret}
                onChange={(_, newValue) => handleFilterChange('pret', newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={200}
                step={10}
              />
            </div>
          </div>

          {/* Sortare */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SortIcon className="text-gray-600" />
              <Typography variant="subtitle1" className="text-gray-700">
                Sortează după:
              </Typography>
            </div>
            <ToggleButtonGroup
              value={sortOrder}
              exclusive
              onChange={(_, newValue) => newValue && setSortOrder(newValue)}
              aria-label="sort order"
              size="small"
            >
              <ToggleButton value="rating" aria-label="rating">
                <span className="flex items-center">
                  <span className="mr-1">Rating</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              </ToggleButton>
              <ToggleButton value="price-asc" aria-label="price ascending">
                <span className="flex items-center">
                  <span className="mr-1">Preț</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </ToggleButton>
              <ToggleButton value="price-desc" aria-label="price descending">
                <span className="flex items-center">
                  <span className="mr-1">Preț</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {/* Buton Clear Filters */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="outlined"
              onClick={clearFilters}
              className="text-red-900 border-red-900 hover:bg-red-50"
            >
              Șterge Filtrele
            </Button>
          </div>

          {/* Afișare Filtre Active */}
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.gen && (
              <Chip
                label={`Gen: ${filters.gen}`}
                onDelete={() => handleFilterChange('gen', '')}
                className="bg-red-100 text-red-800"
              />
            )}
            {filters.sala && (
              <Chip
                label={`Sala: ${filters.sala}`}
                onDelete={() => handleFilterChange('sala', '')}
                className="bg-blue-100 text-blue-800"
              />
            )}
            <Chip
              label={`Durata: ${filters.durata[0]}-${filters.durata[1]} min`}
              onDelete={() => handleFilterChange('durata', [0, 300])}
              className="bg-green-100 text-green-800"
            />
            <Chip
              label={`Preț: ${filters.pret[0]}-${filters.pret[1]} RON`}
              onDelete={() => handleFilterChange('pret', [0, 200])}
              className="bg-yellow-100 text-yellow-800"
            />
          </div>
        </div>

        {error && (
          <Typography color="error" textAlign="center" marginTop={2}>
            {error}
          </Typography>
        )}
        {filteredMovies?.length === 0 && (
          <Typography textAlign="center" color="text.secondary">
            Nu s-au găsit spectacole care să corespundă filtrelor.
          </Typography>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovies &&
            filteredMovies.map((movie) => (
              <div
                key={movie._id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 relative group ${
                  userRole === "admin" ? "opacity-75" : "hover:scale-105"
                }`}
              >
                <Link to={`/movies/${movie._id}`} className="block">
                  <div className="relative">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{movie.gen}</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{movie.durata} min</span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Sala {movie.sala}</span>
                      </div>
                      <div className="mb-3">
                        <RatingComponent
                          averageRating={movie.averageRating || 0}
                          totalRatings={movie.totalRatings || 0}
                          readOnly={true}
                        />
                      </div>
                      <p className="text-gray-500 text-sm mb-2">Regia: {movie.regizor}</p>
                      <p className="text-gray-600 mb-4 line-clamp-3">{movie.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-semibold">
                          {movie.pret} RON
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-6 pb-6">
                  {isLoggedIn && userRole === "user" ? (
                    <Link
                      to={`/booking/${movie._id}`}
                      className="w-full bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors duration-300 block text-center"
                    >
                      Rezervă
                    </Link>
                  ) : isLoggedIn && userRole === "admin" ? (
                    <div className="flex justify-between mt-4">
                      <IconButton onClick={() => handleOpen(movie)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(movie._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      className="w-full bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors duration-300 block text-center group relative"
                    >
                      Rezervă
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-800 text-white text-sm rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        Ups... Autentifica-te pentru rezervarea biletului
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Modal pentru editare */}
        <Modal open={open} onClose={handleClose}>
          <Box sx={style} component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" className="mb-4">
              Editează Spectacol
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Titlu"
                name="title"
                value={currentMovie.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Gen"
                name="gen"
                value={currentMovie.gen}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Regizor"
                name="regizor"
                value={currentMovie.regizor}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Sala"
                name="sala"
                value={currentMovie.sala}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Durata (minute)"
                name="durata"
                type="number"
                value={currentMovie.durata}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Preț (RON)"
                name="pret"
                type="number"
                value={currentMovie.pret}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Număr Locuri"
                name="numarLocuri"
                type="number"
                value={currentMovie.numarLocuri}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="URL Poster"
                name="posterUrl"
                value={currentMovie.posterUrl}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </div>
            <TextField
              label="Descriere"
              name="description"
              value={currentMovie.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />
            <div className="mt-4">
              <Typography variant="subtitle1" className="mb-2">
                Actori
              </Typography>
              <TextField
                label="Actori (separati prin virgula)"
                name="actors"
                value={currentMovie.actors?.join(", ") || ""}
                onChange={(e) => {
                  const actors = e.target.value.split(",").map(actor => actor.trim());
                  setCurrentMovie(prev => ({ ...prev, actors }));
                }}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
            </div>
            <div className="mt-4">
              <Typography variant="subtitle1" className="mb-2">
                Programări
              </Typography>
              {currentMovie.showTimes?.map((showTime, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <TextField
                    label="Data și ora"
                    type="datetime-local"
                    value={showTime.date ? new Date(showTime.date).toISOString().slice(0, 16) : ""}
                    onChange={(e) => {
                      const newShowTimes = [...currentMovie.showTimes];
                      newShowTimes[index].date = e.target.value;
                      setCurrentMovie(prev => ({ ...prev, showTimes: newShowTimes }));
                    }}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Locuri disponibile"
                    type="number"
                    value={showTime.availableSeats}
                    onChange={(e) => {
                      const newShowTimes = [...currentMovie.showTimes];
                      newShowTimes[index].availableSeats = e.target.value;
                      setCurrentMovie(prev => ({ ...prev, showTimes: newShowTimes }));
                    }}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                  <IconButton
                    onClick={() => {
                      const newShowTimes = currentMovie.showTimes.filter((_, i) => i !== index);
                      setCurrentMovie(prev => ({ ...prev, showTimes: newShowTimes }));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
              <Button
                variant="outlined"
                onClick={() => {
                  setCurrentMovie(prev => ({
                    ...prev,
                    showTimes: [...prev.showTimes, { _id: "", date: "", availableSeats: prev.numarLocuri }]
                  }));
                }}
                className="mt-2"
              >
                Adaugă programare
              </Button>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleClose} variant="outlined">
                Anulează
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Salvează
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Movies;