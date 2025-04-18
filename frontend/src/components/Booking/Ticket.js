import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';

const Ticket = ({ movie, seat, showTime, price }) => {
  const ticketId = `EMB${Math.random().toString(36).substr(2, 18).toUpperCase()}`;
  const serialNumber = `DS-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        m: 2, 
        border: '1px solid #ccc',
        position: 'relative',
        maxWidth: '600px',
        backgroundColor: '#fff'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Box 
            component="img" 
            src="http://localhost:5000/uploads/drama-logo.jpg" 
            alt="Logo Teatru" 
            sx={{ 
              width: 100, 
              height: 100, 
              objectFit: 'contain',
              mb: 2,
              borderRadius: '4px'
            }} 
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {movie.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 0.5 }}>
            {movie.sala}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {new Date(showTime.date).toLocaleDateString('ro-RO', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <QRCodeCanvas 
            value={ticketId}
            size={128}
            level="H"
          />
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          Categoria {movie.gen} - {price} RON
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          Rând {Math.floor(seat / movie.numarLocuri)}, loc {seat % movie.numarLocuri || movie.numarLocuri}
        </Typography>
      </Box>

      <Box sx={{ borderTop: '1px solid #eee', pt: 2, fontSize: '0.8rem' }}>
        <Typography variant="caption" display="block">
          Biletul se supune termenilor și condițiilor teatrului.
        </Typography>
        <Typography variant="caption" display="block">
          Biletul nu mai este valabil după începerea spectacolului.
        </Typography>
        <Typography variant="caption" display="block">
          Biletul nu se poate schimba sau returna.
        </Typography>
        <Typography variant="caption" display="block">
          Prețul biletului include Timbrul Crucii Roșii (1%).
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, borderTop: '1px solid #eee', pt: 1 }}>
        <Typography variant="caption">
          S.C DON QUIJOTE S.R.L RO47862819
        </Typography>
        <Typography variant="caption">
          Seria: {serialNumber}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Ticket; 