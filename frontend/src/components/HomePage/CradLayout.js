import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CradLayout = ({ title, description, releaseDate, posterUrl, id }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);

  const handleBooking = () => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }
    if (userRole === 'admin') {
      alert('Adminii nu pot face rezervări. Vă rugăm să folosiți un cont de utilizator normal.');
      return;
    }
    navigate(`/booking/${id}`);
  };

  return (
    <Card
      sx={{
        width: 250,
        height: 320,
        borderRadius: 5,
        ":hover": {
          boxShadow: "10px 10px 20px #ccc",
        },
      }}
    >
      <img
        component="img"
        height="50%"
        width="100%"
        src={posterUrl}
        alt={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(releaseDate).toDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={handleBooking}
          fullWidth
          variant="contained"
          sx={{
            margin: "auto",
            bgcolor: "#2b2d42",
            ":hover": {
              bgcolor: "#121217",
            },
            borderRadius: 5,
          }}
        >
          Rezervă acum
        </Button>
      </CardActions>
    </Card>
  );
};

export default CradLayout;
