import React from "react";
import { Card, CardContent, CardMedia, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie._id}`);
  };

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="300"
        image={movie.posterUrl}
        alt={movie.title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography gutterBottom variant="h5" component="div">
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {movie.description}
        </Typography>
        <Box sx={{ mt: "auto" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie._id}`);
            }}
          >
            Vezi detalii
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard; 