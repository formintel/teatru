import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import { getAllMovies } from "../../api-helpers/api-helpers";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getAllMovies();
        if (response && Array.isArray(response.movies)) {
          // Sortăm filmele după rating în ordine descrescătoare
          const sortedMovies = [...response.movies].sort((a, b) => {
            const ratingA = a.averageRating || 0;
            const ratingB = b.averageRating || 0;
            return ratingB - ratingA;
          });
          setMovies(sortedMovies);
        }
        setLoading(false);
      } catch (error) {
        console.error("Eroare la încărcarea filmelor:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieSelect = (event, value) => {
    if (value) {
      navigate(`/movie/${value._id}`);
    }
  };

  return (
    <Box sx={{ width: 300, mx: "auto", my: 2 }}>
      <Autocomplete
        options={movies}
        getOptionLabel={(option) => option.title}
        loading={loading}
        onChange={handleMovieSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Caută spectacole"
            variant="outlined"
            fullWidth
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body1">{option.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                Rating: {option.averageRating?.toFixed(1) || "N/A"}
              </Typography>
            </Box>
          </Box>
        )}
        noOptionsText="Nu s-au găsit spectacole"
        loadingText="Se încarcă..."
        openOnFocus
        autoHighlight
        blurOnSelect
      />
    </Box>
  );
};

export default SearchBar; 