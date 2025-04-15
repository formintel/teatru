// src/App.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Admin from "./components/Auth/Admin";
import Auth from "./components/Auth/Auth";
import Booking from "./components/Bookings/Booking";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Movies from "./components/Movies/Movies";
import AddMovie from "./components/Movies/AddMovie";
import AdminProfile from "./profile/AdminProfile";
import UserProfile from "./profile/UserProfile";
import { authActions } from "./store";
import AdminMovieDetails from "./components/Movies/AdminMovieDetails";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.role);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    if (userId && role) {
      dispatch(authActions.login({ userId, role, token: localStorage.getItem("token") }));
    }
  }, [dispatch]);

  return (
    <div>
      <Header />
      <section>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<Movies />} />
          {!isLoggedIn && (
            <>
              <Route path="/admin-login" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
            </>
          )}
          {isLoggedIn && userRole === "user" && (
            <>
              <Route path="/user" element={<UserProfile />} />
              <Route path="/booking/:id" element={<Booking />} />
            </>
          )}
          {isLoggedIn && userRole === "admin" && (
            <>
              <Route path="/add" element={<AddMovie />} />
              <Route path="/user-admin" element={<AdminProfile />} />
            </>
          )}
          <Route path="/admin/movies/:id" element={<AdminMovieDetails />} />
        </Routes>
      </section>
    </div>
  );
}

export default App;