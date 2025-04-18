import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { newBooking } from '../../api-helpers/api-helpers';
import Ticket from './Ticket';

const steps = ['Detalii Rezervare', 'Plată', 'Confirmare'];

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movie, selectedSeats, showTimeId, totalPrice } = location.state || {};

  const [activeStep, setActiveStep] = useState(1);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Payment page data:", { movie, selectedSeats, showTimeId, totalPrice });
    if (!movie || !selectedSeats || !showTimeId) {
      setError("Date lipsă pentru rezervare");
    }
  }, [movie, selectedSeats, showTimeId, totalPrice]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
      setError('Toate câmpurile sunt obligatorii');
      return false;
    }
    if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Numărul cardului trebuie să aibă 16 cifre');
      return false;
    }
    if (cardDetails.cvv.length !== 3) {
      setError('CVV-ul trebuie să aibă 3 cifre');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateCardDetails()) return;

    setLoading(true);
    setError('');

    try {
      console.log("Processing payment for:", {
        movieId: movie._id,
        selectedSeats,
        showTimeId,
        totalPrice
      });

      // Simulăm o plată cu cardul
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Creăm rezervarea
      const bookingData = {
        movie: movie._id,
        seatNumbers: selectedSeats,
        date: new Date().toISOString(),
        showTimeId: showTimeId,
        user: localStorage.getItem("userId")
      };

      console.log("Creating booking with data:", bookingData);

      const result = await newBooking(bookingData);
      console.log("Booking result:", result);

      if (result.bookings && result.bookings.length > 0) {
        setActiveStep(2);
      } else {
        throw new Error("Nu s-a putut crea rezervarea");
      }
    } catch (err) {
      console.error("Eroare la procesarea plății:", err);
      setError(err.message || 'A apărut o eroare la procesarea plății. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    navigate('/user-profile');
  };

  if (!movie || !selectedSeats || !showTimeId) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">Datele rezervării nu au fost găsite. Vă rugăm să reveniți la pagina de rezervare.</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/movies')}
          sx={{ mt: 2 }}
        >
          Înapoi la spectacole
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 1 && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Detalii Plată
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Spectacol: {movie.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Locuri selectate: {selectedSeats.join(', ')}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total de plată: {totalPrice} RON
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Număr Card"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                inputProps={{ maxLength: 19 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nume pe Card"
                name="cardName"
                value={cardDetails.cardName}
                onChange={handleCardChange}
                placeholder="ION POPESCU"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Data Expirării"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleCardChange}
                placeholder="MM/YY"
                inputProps={{ maxLength: 5 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleCardChange}
                placeholder="123"
                type="password"
                inputProps={{ maxLength: 3 }}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Înapoi
            </Button>
            <Button
              variant="contained"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Se procesează...' : `Plătește ${totalPrice} RON`}
            </Button>
          </Box>
        </Paper>
      )}

      {activeStep === 2 && (
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
            Plată Reușită!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }} align="center">
            Mai jos sunt biletele dumneavoastră. Le puteți salva sau tipări.
          </Typography>
          
          {selectedSeats.map((seat) => (
            <Ticket
              key={seat}
              movie={movie}
              seat={seat}
              showTime={movie.showTimes.find(st => st._id === showTimeId)}
              price={totalPrice / selectedSeats.length}
            />
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleFinish}
              sx={{ minWidth: 200 }}
            >
              Mergi la Profil
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PaymentPage; 