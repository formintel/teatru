import { Button, FormLabel, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, Chip, Divider } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import SeatSelection from "./SeatSelection"; // Import the new component

const Booking = () => {
  const [movie, setMovie] = useState();
  const [inputs, setInputs] = useState({ 
    seatNumber: "", 
    date: "",
    showTimeId: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getMovieDetails(id)
      .then((res) => {
        setMovie(res.movie);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Nu s-a putut încărca spectacolul.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShowTimeSelect = (e) => {
    const selectedShowTimeId = e.target.value;
    const selectedShowTime = movie.showTimes.find(st => st._id === selectedShowTimeId);
    
    setInputs((prevState) => ({
      ...prevState,
      showTimeId: selectedShowTimeId,
      date: selectedShowTime ? new Date(selectedShowTime.date).toISOString().split('T')[0] : "",
      seatNumber: "" // Reset seat selection when showtime changes
    }));
  };

  const handleSeatSelect = (seatNumber) => {
    setInputs((prevState) => ({
      ...prevState,
      seatNumber: seatNumber.toString()
    }));
  };
  
  const getAvailableSeats = () => {
    if (!inputs.showTimeId || !movie?.showTimes) return null;
    
    const selectedShowTime = movie.showTimes.find(st => st._id === inputs.showTimeId);
    return selectedShowTime ? selectedShowTime.availableSeats : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!inputs.seatNumber || !inputs.date || !inputs.showTimeId) {
      alert("Te rugăm să completezi toate câmpurile.");
      return;
    }
    
    // const availableSeats = getAvailableSeats();
    // if (availableSeats !== null && parseInt(inputs.seatNumber) > availableSeats) {
    //   alert(`Doar ${availableSeats} locuri disponibile pentru această reprezentație.`);
    //   return;
    // }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Trebuie să fii autentificat pentru a face o rezervare!");
      navigate("/auth");
      return;
    }

    newBooking({ 
      seatNumber: inputs.seatNumber, 
      date: inputs.date,
      showTimeId: inputs.showTimeId,
      movie: movie._id, 
      user: userId 
    })
      .then((res) => {
        console.log(res);
        alert("Rezervare creată cu succes!");
        navigate("/user");  // Redirect to user profile or booking confirmation
      })
      .catch((err) => {
        console.log(err);
        alert("Eroare la crearea rezervării. Te rugăm să încerci din nou.");
      });
  };

  if (loading) {
    return <Typography textAlign="center" variant="h5" mt={5}>Se încarcă detaliile spectacolului...</Typography>;
  }

  if (error) {
    return <Typography textAlign="center" color="error" variant="h5" mt={5}>{error}</Typography>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {movie && (
        <Fragment>
          <Typography
            variant="h4"
            textAlign={"center"}
            className="font-serif mb-8"
          >
            Rezervă bilete pentru: {movie.title}
          </Typography>
          
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex flex-col">
                {/* Top section - Movie details */}
                <div className="p-6">
                  <div className="flex mb-6">
                    <img
                      className="w-1/3 md:w-1/6 h-auto object-cover rounded"
                      src={movie.posterUrl}
                      alt={movie.title}
                    />
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold">{movie.title}</h2>
                      <div className="flex flex-wrap gap-2 my-2">
                        <Chip label={movie.gen} size="small" color="primary" />
                        <Chip label={`${movie.durata} minute`} size="small" />
                        <Chip label={`Sala ${movie.sala}`} size="small" />
                      </div>
                      <p className="text-gray-700 mt-1">Regia: <span className="font-semibold">{movie.regizor}</span></p>
                      <p className="text-gray-700 mt-1">Preț: <span className="font-semibold text-green-600">{movie.pret} RON</span></p>
                    </div>
                  </div>
                </div>
                
                {/* Booking section */}
                <div className="px-6 pb-6">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="showtime-select-label">Alege reprezentația</InputLabel>
                        <Select
                          labelId="showtime-select-label"
                          id="showtime-select"
                          name="showTimeId"
                          value={inputs.showTimeId}
                          onChange={handleShowTimeSelect}
                          label="Alege reprezentația"
                          required
                        >
                          {Array.isArray(movie.showTimes) && movie.showTimes.length > 0 ? (
                            movie.showTimes.map((showTime) => {
                              if (!showTime || !showTime.date) {
                                console.error("Lipsă showTime sau date:", showTime);
                                return null;
                              }

                              const showDate = new Date(showTime.date);
                              if (isNaN(showDate.getTime())) {
                                console.error("Dată invalidă:", showTime.date);
                                return null;
                              }

                              const formattedShowDate = format(showDate, "d MMMM yyyy, HH:mm", { locale: ro });

                              return (
                                <MenuItem key={showTime._id} value={showTime._id}>
                                  {formattedShowDate} ({showTime.availableSeats} locuri disponibile)
                                </MenuItem>
                              );
                            })
                          ) : (
                            <MenuItem value="" disabled>
                              Nu există spectacole disponibile
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </div>
                    
                    {/* Seat Selection Component */}
                    <Box sx={{ mt: 3 }}>
                      <SeatSelection 
                        movie={movie} 
                        showTimeId={inputs.showTimeId} 
                        onSeatSelect={handleSeatSelect} 
                      />
                    </Box>
                    
                    <div className="mt-6">
                      <Button 
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={!inputs.seatNumber || !inputs.showTimeId}
                        sx={{
                          bgcolor: "#2b2d42",
                          ":hover": {
                            bgcolor: "#121217",
                          },
                          py: 1.5
                        }}
                      >
                        Finalizează rezervarea
                      </Button>
                    </div>
                    
                    {inputs.showTimeId && inputs.seatNumber && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md text-blue-800 text-sm">
                        <p><strong>Notă:</strong> Vei rezerva un bilet pentru spectacolul "{movie.title}" la locul <strong>{inputs.seatNumber}</strong> la prețul de {movie.pret} RON.</p>
                        <p className="mt-1">Te rugăm să te prezinți cu 30 de minute înainte de începerea spectacolului.</p>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Booking;