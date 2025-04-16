import { Typography, Box, Grid, Card, CardContent, Chip, Divider, Button } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, addRating, getUserRating } from "../../api-helpers/api-helpers";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RatingComponent from "./RatingComponent";
import { useSelector } from "react-redux";

const AdminMovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    setLoading(true);
    getMovieDetails(id)
      .then((res) => {
        console.log("Date complete primite de la backend:", res);
        console.log("ShowTimes din backend:", res.movie.showTimes);
        setMovie(res.movie);
        if (isLoggedIn) {
          getUserRating(id, userId)
            .then(rating => setUserRating(rating))
            .catch(err => console.log(err));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Nu s-a putut încărca spectacolul.");
        setLoading(false);
      });
  }, [id, userId, isLoggedIn]);

  const handleRatingChange = async (newValue) => {
    if (!isLoggedIn) {
      alert("Trebuie să fii autentificat pentru a evalua spectacolul!");
      return;
    }

    try {
      const result = await addRating(id, userId, newValue);
      setMovie(prev => ({
        ...prev,
        averageRating: result.averageRating,
        totalRatings: result.totalRatings
      }));
      setUserRating(newValue);
    } catch (err) {
      console.log(err);
      alert("Eroare la adăugarea rating-ului!");
    }
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
          <div className="container mx-auto px-4">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Înapoi
            </Button>

            <Typography
              variant="h4"
              textAlign={"center"}
              className="font-serif mb-8"
            >
              Detalii spectacol: {movie.title}
            </Typography>
            
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  {/* Imagine și titlu */}
                  <Grid item xs={12} md={4}>
                    <Box
                      component="img"
                      src={movie.posterUrl}
                      alt={movie.title}
                      sx={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        boxShadow: 3,
                      }}
                    />
                    <Box className="mt-4">
                      <RatingComponent
                        averageRating={movie.averageRating || 0}
                        totalRatings={movie.totalRatings || 0}
                        userRating={userRating}
                        onRatingChange={handleRatingChange}
                        readOnly={false}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>
                      {movie.title}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip label={movie.gen} color="primary" sx={{ mr: 1 }} />
                      <Chip label={`${movie.durata} minute`} sx={{ mr: 1 }} />
                      <Chip label={`${movie.pret} RON`} color="success" />
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      Despre spectacol
                    </Typography>
                    <Typography paragraph>{movie.description}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Regizor
                        </Typography>
                        <Typography variant="body1">{movie.regizor}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Sala
                        </Typography>
                        <Typography variant="body1">{movie.sala}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Număr de locuri
                        </Typography>
                        <Typography variant="body1">{movie.numarLocuri}</Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                      Actori
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {movie.actors.map((actor, index) => (
                        <Chip key={index} label={actor} variant="outlined" />
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                      Reprezentații
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {movie.showTimes.map((showTime, index) => {
                        console.log("ShowTime procesat:", showTime);
                        console.log("Tipul datei:", typeof showTime.date);
                        console.log("Valoarea datei:", showTime.date);
                        
                        let formattedDate = "Data indisponibilă";
                        
                        try {
                          if (showTime.date) {
                            // Verificăm dacă data este deja un obiect Date
                            const date = showTime.date instanceof Date ? showTime.date : new Date(showTime.date);
                            console.log("Data convertită:", date);
                            
                            if (!isNaN(date.getTime())) {
                              formattedDate = format(date, "EEEE, d MMMM yyyy, HH:mm", { locale: ro });
                              console.log("Data formatată:", formattedDate);
                            } else {
                              console.log("Data invalidă:", date);
                            }
                          } else {
                            console.log("Nu există câmpul date în showTime");
                          }
                        } catch (error) {
                          console.error("Eroare la formatarea datei:", error);
                          console.error("ShowTime care a cauzat eroarea:", showTime);
                        }

                        return (
                          <div key={index} className="bg-white p-4 rounded-lg shadow">
                            <p className="text-gray-800 font-medium">{formattedDate}</p>
                            <p className="text-gray-600">Locuri disponibile: {showTime.availableSeats}</p>
                          </div>
                        );
                      })}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default AdminMovieDetails; 