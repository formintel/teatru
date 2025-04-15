// src/components/Movies/AllMovies.js
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../api-helpers/api-helpers"; // Corectăm importul

const AllMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box margin="auto" marginTop={4}>
      <Typography variant="h4" padding={2} textAlign="center">
        Toate Spectacolele
      </Typography>
      <Box
        margin="auto"
        width="100%"
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={4}
      >
        {movies &&
          movies.map((movie, index) => (
            <Box
              key={index}
              sx={{
                width: 300,
                borderRadius: 5,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                overflow: "hidden",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                style={{ width: "100%", height: 200, objectFit: "cover" }}
              />
              <Box p={2}>
                <Typography variant="h6">{movie.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.description}
                </Typography>
                <Typography variant="body2" color="error" mt={1}>
                  {movie.pret} RON
                </Typography>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default AllMovies;