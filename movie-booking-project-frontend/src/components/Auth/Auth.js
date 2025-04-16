// components/Auth.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendUserAuthRequest } from "../../api-helpers/api-helpers";
import { authActions } from "../../store";
import AuthForm from "./AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onResReceived = (data) => {
    console.log("Răspuns primit:", data);
    if (data.token) {
      const role = data.role || "user";
      dispatch(authActions.login({
        userId: data.id,
        role: role,
        token: data.token,
      }));
      localStorage.setItem("userId", data.id);
      localStorage.setItem("role", role);
      localStorage.setItem("token", data.token);
      
      if (role === "admin") {
        navigate("/user-admin");
      } else {
        navigate("/");
      }
    } else if (data.success) {
      setSuccess(data.message);
      setError("");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } else {
      setError("Email sau parolă incorecte");
    }
  };

  const getData = async (data) => {
    console.log("Încercare autentificare:", data);
    setError("");
    setSuccess("");

    try {
      const response = await sendUserAuthRequest(data.inputs, data.signup);
      console.log("Răspuns autentificare:", response);
      onResReceived(response);
    } catch (err) {
      console.log("Eroare în componenta Auth:", err);
      if (err.message) {
        setError(err.message);
      } else {
        setError("Email sau parolă incorecte");
      }
    }
  };

  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={false} error={error} success={success} />
    </div>
  );
};

export default Auth;