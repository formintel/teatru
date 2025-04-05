import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendAdminAuthRequest } from "../../api-helpers/api-helpers";
import { adminActions } from "../../store";
import AuthForm from "./AuthForm";

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const onResReceived = (data) => {
    console.log("Răspuns primit de la server pentru admin:", data);
    // Verificăm dacă avem un răspuns valid de la server
    if (data.id && data.token) {
      dispatch(adminActions.login());
      localStorage.setItem("adminId", data.id);
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      setError("Email sau parolă incorecte");
    }
  };

  const getData = async (data) => {
    console.log("Încercare autentificare admin:", data);
    setError(""); // Resetăm eroarea la fiecare încercare
    try {
      const response = await sendAdminAuthRequest(data.inputs);
      onResReceived(response);
    } catch (err) {
      console.log("Eroare în componenta Admin:", err);
      if (err.message) {
        setError(err.message);
      } else {
        setError("Email sau parolă incorecte");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Panou de Administrare
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Această secțiune este destinată doar administratorilor.
          </p>
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Dacă nu ai credențiale de administrator, te rugăm să te autentifici ca utilizator normal.
                </p>
              </div>
            </div>
          </div>
        </div>
        <AuthForm onSubmit={getData} isAdmin={true} error={error} />
      </div>
    </div>
  );
};

export default Admin;
