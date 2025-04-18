// components/AdminAuth.js
import {
  Box,
  Button,
  Dialog,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendAdminAuthRequest } from "../../api-helpers/api-helpers";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";

const labelSx = { marginRight: "auto", mt: 1, mb: 1 };

const AdminAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [inputs, setInputs] = useState({ email: "", password: "" });

  const onClose = () => {
    setOpen(false);
    navigate("/");
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onRequestSent = (data) => {
    dispatch(authActions.login({
      userId: data.id,
      role: data.role,
      token: data.token,
    }));
    localStorage.setItem("userId", data.id);
    localStorage.setItem("role", data.role);
    localStorage.setItem("token", data.token);
    setOpen(false);
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendAdminAuthRequest(inputs)
      .then(onRequestSent)
      .catch((err) => console.log(err));
    setInputs({ email: "", password: "" });
  };

  return (
    <Dialog PaperProps={{ style: { borderRadius: 20 } }} open={open}>
      <Box sx={{ marginLeft: "auto", padding: 1 }}>
        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <Typography variant="h4" textAlign={"center"}>
        {"Login Admin"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          alignItems={"center"}
          width={400}
          padding={6}
          margin="auto"
          display="flex"
          flexDirection={"column"}
        >
          <FormLabel sx={labelSx}>Email</FormLabel>
          <TextField
            onChange={handleChange}
            value={inputs.email}
            name="email"
            type="email"
            variant="standard"
            fullWidth
            margin="normal"
            placeholder="Email"
          />
          <FormLabel sx={labelSx}>Password</FormLabel>
          <TextField
            onChange={handleChange}
            value={inputs.password}
            name="password"
            type={"password"}
            variant="standard"
            fullWidth
            margin="normal"
            placeholder="Password"
          />
          <Button
            sx={{ borderRadius: 10, mt: 2, bgcolor: "#2b2d42" }}
            type="submit"
            fullWidth
            variant="contained"
          >
            {"Login"}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default AdminAuth;