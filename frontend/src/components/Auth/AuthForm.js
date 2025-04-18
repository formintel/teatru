import {
  Box,
  Button,
  Dialog,
  FormLabel,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Link } from "react-router-dom";

const labelStyle = { mt: 1, mb: 1 };

const AuthForm = ({ onSubmit, isAdmin, error, success }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ inputs, signup: isAdmin ? false : isSignup });
  };

  return (
    <Dialog 
      PaperProps={{ 
        style: { 
          borderRadius: isMobile ? 10 : 20,
          width: isMobile ? '90%' : isTablet ? '70%' : '400px',
          maxWidth: '400px',
          margin: 'auto'
        } 
      }} 
      open={true}
      fullScreen={isMobile}
    >
      <Box sx={{ 
        ml: "auto", 
        padding: isMobile ? 0.5 : 1,
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? 0 : 'auto',
        right: isMobile ? 0 : 'auto'
      }}>
        <IconButton LinkComponent={Link} to="/">
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        textAlign={"center"}
        sx={{ 
          mt: isMobile ? 4 : 0,
          px: isMobile ? 2 : 0
        }}
      >
        {isSignup ? "Înregistrare" : "Autentificare"}
      </Typography>
      
      <Typography 
        variant={isMobile ? "body2" : "body1"} 
        textAlign={"center"} 
        color="text.secondary" 
        sx={{ 
          mt: 2, 
          mb: 3,
          px: isMobile ? 2 : 0
        }}
      >
        {isSignup 
          ? "Creează un cont pentru a putea rezerva bilete la spectacole" 
          : "Autentifică-te pentru a putea rezerva bilete la spectacole"}
      </Typography>

      {error && (
        <Typography 
          variant="body2" 
          color="error" 
          textAlign="center" 
          sx={{ 
            bgcolor: 'error.light', 
            color: 'white', 
            p: 1, 
            borderRadius: 1,
            mb: 2,
            mx: isMobile ? 2 : 0
          }}
        >
          {error}
        </Typography>
      )}

      {success && (
        <Typography 
          variant="body2" 
          color="success" 
          textAlign="center" 
          sx={{ 
            bgcolor: 'success.light', 
            color: 'white', 
            p: 1, 
            borderRadius: 1,
            mb: 2,
            mx: isMobile ? 2 : 0
          }}
        >
          {success}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Box
          padding={isMobile ? 3 : 6}
          display={"flex"}
          justifyContent={"center"}
          flexDirection="column"
          width="100%"
          maxWidth={400}
          margin="auto"
          alignContent={"center"}
        >
          {!isAdmin && isSignup && (
            <>
              <FormLabel sx={labelStyle}>Name</FormLabel>
              <TextField
                value={inputs.name}
                onChange={handleChange}
                margin="normal"
                variant="standard"
                type={"text"}
                name="name"
                fullWidth
              />
            </>
          )}
          <FormLabel sx={labelStyle}>Email</FormLabel>
          <TextField
            value={inputs.email}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type={"email"}
            name="email"
            fullWidth
          />
          <FormLabel sx={labelStyle}>Password</FormLabel>
          <TextField
            value={inputs.password}
            onChange={handleChange}
            margin="normal"
            variant="standard"
            type={"password"}
            name="password"
            fullWidth
          />
          <Button
            sx={{ 
              mt: 2, 
              borderRadius: 10, 
              bgcolor: "#2b2d42",
              py: isMobile ? 1 : 1.5
            }}
            type="submit"
            fullWidth
            variant="contained"
          >
            {isSignup ? "Înregistrare" : "Autentificare"}
          </Button>
          {!isAdmin && (
            <Button
              onClick={() => setIsSignup(!isSignup)}
              sx={{ 
                mt: 2, 
                borderRadius: 10,
                py: isMobile ? 1 : 1.5
              }}
              fullWidth
            >
              {isSignup ? "Ai deja cont? Autentifică-te" : "Nu ai cont? Înregistrează-te"}
            </Button>
          )}
        </Box>
      </form>
    </Dialog>
  );
};

export default AuthForm;
