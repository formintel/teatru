import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getMovieDetails, getOccupiedSeats, newBooking } from '../../api-helpers/api-helpers';
import { theaterConfig } from '../../config/theater-config';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Booking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTime, setShowTime] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await getMovieDetails(id);
        console.log("Răspuns de la getMovieDetails în Booking:", response);

        if (!response || !response.movie) {
          throw new Error("Nu s-au primit date pentru spectacol");
        }

        const movieData = response.movie;

        // Verificăm și setăm valorile implicite pentru câmpurile lipsă
        const defaultValues = {
          title: "Titlu necunoscut",
          description: "Descriere indisponibilă",
          posterUrl: "/default-poster.jpg",
          sala: "Sala necunoscută",
          numarLocuri: 0,
          pret: 0,
          regizor: "Regizor necunoscut",
          durata: 0,
          gen: "Gen necunoscut",
          showTimes: []
        };

        // Setăm valorile implicite pentru câmpurile lipsă
        Object.keys(defaultValues).forEach(field => {
          if (!movieData[field]) {
            console.warn(`Câmpul ${field} lipsește, se setează valoarea implicită:`, defaultValues[field]);
            movieData[field] = defaultValues[field];
          }
        });

        // Verificăm dacă avem showTimes
        if (!movieData.showTimes || !Array.isArray(movieData.showTimes)) {
          console.warn("Nu s-au găsit showTimes, se setează array gol");
          movieData.showTimes = [];
        }

        setMovie(movieData);
        setLoading(false);
      } catch (error) {
        console.error("Eroare la încărcarea detaliilor spectacolului:", error);
        setError(error.message || "Nu s-a putut încărca spectacolul.");
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    } else {
      setError('ID-ul spectacolului nu a fost specificat');
    }
  }, [id]);

  useEffect(() => {
    const fetchOccupiedSeats = async () => {
      if (showTime) {
        try {
          const data = await getOccupiedSeats(movie._id, showTime._id);
          setOccupiedSeats(data.occupiedSeats || []);
        } catch (err) {
          setError('Nu s-au putut încărca locurile ocupate');
        }
      }
    };

    fetchOccupiedSeats();
  }, [showTime, movie]);

  const handleSeatClick = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handleShowTimeSelect = (showTime) => {
    setShowTime(showTime);
    setSelectedSeats([]);
  };

  const handleBooking = () => {
    if (!selectedSeats.length) {
      alert("Vă rugăm să selectați cel puțin un loc!");
      return;
    }

    if (!showTime) {
      alert("Vă rugăm să selectați o reprezentație!");
      return;
    }

    const totalPrice = selectedSeats.length * movie.pret;

    const bookingData = {
      movie: movie,
      selectedSeats,
      showTimeId: showTime._id,
      date: showTime.date,
      totalPrice: totalPrice
    };

    console.log("Date pentru rezervare:", bookingData);
    navigate("/payment", { state: bookingData });
  };

  const renderSeats = () => {
    return theaterConfig.sections.map((section, sectionIndex) => (
      <Box key={section.name} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {section.name}
        </Typography>
        <Grid container spacing={1} justifyContent="center">
          {Array.from({ length: section.rows * section.seatsPerRow }).map((_, index) => {
            const seatNumber = section.startSeatNumber + index;
            const isOccupied = occupiedSeats.includes(seatNumber);
            const isSelected = selectedSeats.includes(seatNumber);
            const seatInfo = theaterConfig.getSeatInfo(seatNumber);
            
            return (
              <Grid item key={seatNumber}>
                <Button
                  variant={isSelected ? "contained" : "outlined"}
                  color={isOccupied ? "error" : "primary"}
                  disabled={isOccupied}
                  onClick={() => handleSeatClick(seatNumber)}
                  sx={{
                    minWidth: '40px',
                    height: '40px',
                    m: 0.5,
                    position: 'relative'
                  }}
                >
                  {seatNumber}
                  {seatInfo && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        bottom: 2,
                        fontSize: '0.6rem',
                        color: isSelected ? 'white' : 'text.secondary'
                      }}
                    >
                      R{seatInfo.row}-L{seatInfo.seatInRow}
                    </Typography>
                  )}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    ));
  };

  if (!movie) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">Nu s-au putut încărca detaliile spectacolului</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Înapoi
      </Button>

      <Typography variant="h4" gutterBottom>
        Rezervare: {movie.title}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Selectează Reprezentația
        </Typography>
        <Grid container spacing={2}>
          {movie.showTimes.map((showTime) => (
            <Grid item key={showTime._id}>
              <Button
                variant={showTime._id === showTime?._id ? "contained" : "outlined"}
                onClick={() => handleShowTimeSelect(showTime)}
              >
                {new Date(showTime.date).toLocaleString('ro-RO', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {showTime && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selectează Locurile
          </Typography>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Scena
            </Typography>
          </Box>
          {renderSeats()}
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleBooking}
          disabled={!showTime || selectedSeats.length === 0}
        >
          Finalizează Rezervarea
        </Button>
      </Box>
    </Box>
  );
};

export default Booking; 