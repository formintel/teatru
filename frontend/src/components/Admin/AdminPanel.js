import React from 'react';
import { Box, Grid, Paper, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import BookingsIcon from '@mui/icons-material/BookOnline';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';

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
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
  };

  const cards = [
    {
      title: 'Adaugă Spectacol',
      icon: AddIcon,
      color: '#1976d2',
      path: '/admin/add-movie',
      description: 'Adaugă spectacole noi în sistem'
    },
    {
      title: 'Rezervări',
      icon: BookingsIcon,
      color: '#ed6c02',
      path: '/admin/manage-bookings',
      description: 'Gestionează rezervările spectatorilor'
    },
    {
      title: 'Statistici',
      icon: AnalyticsIcon,
      color: '#9c27b0',
      path: '/admin/statistics',
      description: 'Vizualizează statistici și rapoarte'
    },
    {
      title: 'Gestionare Conturi',
      icon: PeopleIcon,
      color: '#0288d1',
      path: '/admin/users',
      description: 'Administrează conturile utilizatorilor'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#2b2d42',
            borderBottom: '3px solid #1976d2',
            paddingBottom: 2,
            marginBottom: 4
          }}
        >
          Panou de Administrare
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                ...cardStyle,
                bgcolor: card.color,
                color: 'white',
              }}
              onClick={() => navigate(card.path)}
            >
              <card.icon sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {card.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  textAlign: 'center',
                  opacity: 0.9,
                  px: 2
                }}
              >
                {card.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminPanel; 