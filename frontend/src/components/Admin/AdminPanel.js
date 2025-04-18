import React from 'react';
import { Box, Grid, Paper, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MovieIcon from '@mui/icons-material/Movie';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';

const AdminPanel = () => {
  const navigate = useNavigate();

  const cardStyle = {
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#2b2d42' }}>
        Panou de Administrare
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              ...cardStyle,
              bgcolor: '#1976d2',
              color: 'white',
            }}
            onClick={() => navigate('/admin/add-movie')}
          >
            <AddIcon sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6">Adaugă Spectacol</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              ...cardStyle,
              bgcolor: '#2e7d32',
              color: 'white',
            }}
            onClick={() => navigate('/movies')}
          >
            <MovieIcon sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6">Gestionează Spectacole</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              ...cardStyle,
              bgcolor: '#ed6c02',
              color: 'white',
            }}
            onClick={() => navigate('/admin/add-show')}
          >
            <EventIcon sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6">Adaugă Reprezentație</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              ...cardStyle,
              bgcolor: '#9c27b0',
              color: 'white',
            }}
            onClick={() => navigate('/admin/users')}
          >
            <PeopleIcon sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6">Gestionează Utilizatori</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanel; 