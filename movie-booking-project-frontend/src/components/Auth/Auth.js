import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendUserAuthRequest } from "../../api-helpers/api-helpers";
import { userActions } from "../../store";
import AuthForm from "./AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onResReceived = (data) => {
    console.log("Răspuns primit:", data);
    if (data.message === "Login Successfull") {
      dispatch(userActions.login());
      localStorage.setItem("userId", data.id);
      navigate("/");
    } else if (data.success) {
      // Dacă este înregistrare reușită, afișăm mesajul de succes
      setSuccess(data.message);
      setError("");
      // Resetăm formularul după 2 secunde
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } else {
      setError("Email sau parolă incorecte");
    }
  };

  const getData = async (data) => {
    console.log("Încercare autentificare:", data);
    setError(""); // Resetăm eroarea la fiecare încercare
    setSuccess(""); // Resetăm mesajul de succes la fiecare încercare
    try {
      const response = await sendUserAuthRequest(data.inputs, data.signup);
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
