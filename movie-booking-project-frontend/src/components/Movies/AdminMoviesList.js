import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Grid,
  Container
} from '@mui/material';
import { getAdminMovies } from '../../api-helpers/api-helpers';

const AdminMoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getAdminMovies();
        setMovies(data.movies);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Nu s-au putut încărca spectacolele');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Se încarcă...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lista Spectacole
      </Typography>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={movie.posterUrl}
                alt={movie.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {movie.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Link to={`/admin/movies/${movie._id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary" fullWidth>
                      Detalii
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminMoviesList; 