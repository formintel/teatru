import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
  Chip
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const MovieItem = ({ 
  title, 
  releaseDate, 
  posterUrl, 
  id, 
  pret, 
  durata, 
  gen, 
  sala,
  regizor
}) => {
  const formattedDate = format(new Date(releaseDate), "d MMMM yyyy", { locale: ro });

  return (
    <Card
      sx={{
        margin: 2,
        width: 300,
        height: "auto",
        borderRadius: 5,
        ":hover": {
          boxShadow: "10px 10px 20px #ccc",
        },
      }}
    >
      <img height={200} width="100%" src={posterUrl} alt={title} style={{ objectFit: "cover" }} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
          <Chip label={gen} size="small" color="primary" />
          <Chip label={`${durata} min`} size="small" />
          <Chip label={`Sala ${sala}`} size="small" />
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Regia: {regizor}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formattedDate}
        </Typography>
        <Typography variant="h6" color="error" mt={1}>
          {pret} RON
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          LinkComponent={Link}
          to={`/booking/${id}`}
          sx={{
            margin: "auto",
            bgcolor: "#2b2d42",
            ":hover": {
              bgcolor: "#121217",
            },
          }}
          size="small"
        >
          Rezervă bilet
        </Button>
      </CardActions>
    </Card>
  );
};

export default MovieItem;