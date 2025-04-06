import React, { Fragment, useEffect, useState } from "react";
import {
  deleteBooking,
  getUserBooking,
  getUserDetails,
} from "../api-helpers/api-helpers";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { IconButton } from "@mui/material";

const UserProfile = () => {
  const [bookings, setBookings] = useState();
  const [user, setUser] = useState();
  
  useEffect(() => {
    getUserBooking()
      .then((res) => setBookings(res.bookings))
      .catch((err) => console.log(err));

    getUserDetails()
      .then((res) => setUser(res.user))
      .catch((err) => console.log(err));
  }, []);
  
  const handleDelete = (id) => {
    deleteBooking(id)
      .then(() => {
        // Actualizează starea locală după ștergere
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== id));
      })
      .catch((err) => console.log(err));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="h-48 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
      
      <div className="container mx-auto px-4 -mt-24">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profil Utilizator */}
          {user && (
            <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6 mb-6 md:mb-0">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                  <AccountCircleIcon className="text-gray-400" style={{ fontSize: "5rem" }} />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{user.name}</h2>
                
                <div className="w-full space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                      <span className="text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nume</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Rezervări */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Rezervările mele
              </h3>
              
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking, index) => (
                    <div 
                      key={index} 
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <LocalMoviesIcon className="text-emerald-500 mr-2" />
                            <h4 className="text-lg font-semibold text-gray-800">{booking.movie.title}</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <EventSeatIcon className="h-4 w-4 mr-1 text-gray-400" />
                              <span>Loc: {booking.seatNumber}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                              <CalendarTodayIcon className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{new Date(booking.date).toLocaleDateString('ro-RO', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="p-2 rounded-full text-red-500 hover:bg-red-50 transition duration-200"
                          >
                            <DeleteForeverIcon />
                          </button>
                        </div>
                      </div>
                      
                      {/* Bară de stare */}
                      <div className="h-1 w-full bg-emerald-500"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <svg 
                    className="mx-auto h-12 w-12 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nu ai nicio rezervare</h3>
                  <p className="mt-1 text-sm text-gray-500">Începe prin a rezerva un loc la filmul preferat.</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => window.location.href = '/'}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none"
                    >
                      Rezervă acum
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;