// src/App.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import Admin from "./components/Auth/Admin";
import Auth from "./components/Auth/Auth";
import Booking from "./components/Booking/Booking";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Movies from "./components/Movies/Movies";
import AddMovie from "./components/Movies/AddMovie";
import AdminProfile from "./profile/AdminProfile";
import UserProfile from "./profile/UserProfile";
import { authActions } from "./store";
import AdminMovieDetails from "./components/Movies/AdminMovieDetails";
import PaymentPage from "./components/Booking/PaymentPage";
import AdminPanel from './components/Admin/AdminPanel';
import ManageMovies from './components/Admin/ManageMovies';
import ManageBookings from './components/Admin/ManageBookings';
import Statistics from './components/Admin/Statistics';
import ManageUsers from './components/Admin/ManageUsers';

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
      <main className="pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<AdminMovieDetails />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Rute protejate pentru utilizatori autentificați */}
          <Route 
            path="/payment" 
            element={
              isLoggedIn && userRole === "user" ? (
                <PaymentPage />
              ) : (
                <Navigate to="/auth" replace state={{ from: "/payment" }} />
              )
            } 
          />
          
          {/* Rută pentru autentificare admin */}
          <Route 
            path="/admin-login" 
            element={
              !isLoggedIn ? <Admin /> : <Navigate to="/admin" replace />
            } 
          />
          
          {/* Rute pentru utilizatori normali */}
          {isLoggedIn && userRole === "user" && (
            <>
              <Route path="/user" element={<UserProfile />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/booking/:id" element={<Booking />} />
            </>
          )}
          
          {/* Rute pentru admin */}
          {isLoggedIn && userRole === "admin" ? (
            <>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/add-movie" element={<AddMovie />} />
              <Route path="/admin/manage-movies" element={<ManageMovies />} />
              <Route path="/admin/manage-bookings" element={<ManageBookings />} />
              <Route path="/admin/statistics" element={<Statistics />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </>
          ) : (
            <Route path="/admin/*" element={<Navigate to="/admin-login" replace />} />
          )}

          {/* Rută pentru pagini inexistente */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;