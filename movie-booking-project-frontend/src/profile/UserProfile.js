import React, { useEffect, useState } from 'react';
import {
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserBooking, deleteBooking } from '../api-helpers/api-helpers';
import { useNavigate } from 'react-router-dom';
import Ticket from '../components/Booking/Ticket';

const UserProfile = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    // Verificăm dacă utilizatorul este autentificat
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/auth");
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const response = await getUserBooking();
      if (response?.bookings) {
        // Filtrăm rezervările invalide
        const validBookings = response.bookings.filter(
          booking => booking && booking.movie && booking.movie.title
        );
        setBookings(validBookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      setError('Nu s-au putut încărca rezervările.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (booking) => {
    setTicketToDelete(booking);
    setDeleteConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBooking(ticketToDelete._id);
      setDeleteConfirmDialog(false);
      setShowSuccessMessage(true);
      fetchBookings();
    } catch (err) {
      setError('Nu s-a putut șterge rezervarea.');
      console.error(err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmDialog(false);
    setTicketToDelete(null);
  };

  const handleOpenTicket = (booking) => {
    if (booking && booking.movie) {
      setSelectedTicket(booking);
      setOpenDialog(true);
    }
  };

  const handleCloseTicket = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Se încarcă rezervările...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Rezervările mele
      </Typography>

      {(!bookings || bookings.length === 0) ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Nu aveți rezervări active
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/movies')}
          >
            Vezi spectacolele disponibile
          </Button>
        </Box>
      ) : (
        <List>
          {bookings.map((booking) => (
            booking && booking.movie && (
              <ListItem 
                key={booking._id}
                sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                  p: 2
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">
                    {booking.movie.title}
                  </Typography>
                  <Typography variant="body1">
                    Data: {new Date(booking.date).toLocaleDateString('ro-RO')}
                  </Typography>
                  <Typography variant="body2">
                    Loc: {booking.seatNumber}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenTicket(booking)}
                  >
                    Vezi biletul
                  </Button>
                  <IconButton 
                    onClick={() => handleDeleteClick(booking)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            )
          ))}
        </List>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseTicket}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Biletul dumneavoastră
        </DialogTitle>
        <DialogContent>
          {selectedTicket && selectedTicket.movie && (
            <Ticket
              movie={selectedTicket.movie}
              seat={selectedTicket.seatNumber}
              showTime={{ date: selectedTicket.date }}
              price={selectedTicket.movie.pret}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTicket}>Închide</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmDialog}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>
          Confirmați anularea rezervării
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sunteți sigur că doriți să anulați această rezervare? 
            Suma de {ticketToDelete?.movie?.pret} RON va fi returnată în contul dumneavoastră în 3-5 zile lucrătoare.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Anulează</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Confirmă anularea
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={showSuccessMessage} 
        autoHideDuration={6000} 
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Rezervarea a fost anulată cu succes. Suma va fi returnată în contul dumneavoastră în 3-5 zile lucrătoare.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;