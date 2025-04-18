// src/api-helpers/api-helpers.js
import axios from "axios";

// Configurare pentru axios
const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // mărim timeout-ul la 15 secunde
});

// Interceptor pentru request-uri
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Asigură-te că token-ul este trimis corect
      config.headers.Authorization = `Bearer ${token.trim()}`;
      console.log("Token trimis în request:", config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor pentru response-uri
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

// Funcție pentru a obține header-ul de autentificare
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Preluare toate spectacolele
export const getAllMovies = async (inCurs = false) => {
  try {
    const res = await instance.get(`/movie?inCurs=${inCurs}`);
    if (res.status !== 200) {
      throw new Error("Eroare la preluarea spectacolelor");
    }
    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea spectacolelor:", err);
    throw err;
  }
};

// Preluare detalii spectacol
export const getMovieDetails = async (id) => {
  try {
    console.log("Încercăm să obținem detaliile filmului cu ID:", id);
    const res = await instance.get(`/movie/${id}`);
    console.log("Răspuns primit pentru detaliile filmului:", res.data);
    
    if (res.status !== 200) {
      throw new Error("Eroare la preluarea detaliilor spectacolului");
    }

    // Verificăm dacă avem date în răspuns
    if (!res.data) {
      throw new Error("Nu s-au primit date de la server");
    }

    // Verificăm dacă avem un obiect movie în răspuns
    const movieData = res.data.movie || res.data;
    if (!movieData) {
      throw new Error("Nu s-au găsit date pentru film");
    }

    // Verificăm dacă showTimes există și este un array
    if (!movieData.showTimes || !Array.isArray(movieData.showTimes)) {
      console.warn("Date invalide pentru showTimes:", movieData.showTimes);
      movieData.showTimes = []; // Setăm un array gol dacă nu există showTimes
    }

    // Verificăm câmpurile necesare și le setăm valori implicite dacă lipsesc
    const requiredFields = {
      title: "Titlu necunoscut",
      description: "Descriere indisponibilă",
      posterUrl: "/default-poster.jpg",
      sala: "Sala necunoscută",
      numarLocuri: 0,
      pret: 0,
      regizor: "Regizor necunoscut",
      durata: 0,
      gen: "Gen necunoscut"
    };

    // Setăm valorile implicite pentru câmpurile lipsă
    Object.keys(requiredFields).forEach(field => {
      if (!movieData[field]) {
        console.warn(`Câmpul ${field} lipsește, se setează valoarea implicită:`, requiredFields[field]);
        movieData[field] = requiredFields[field];
      }
    });

    // Verificăm dacă avem actori
    if (!movieData.actors || !Array.isArray(movieData.actors)) {
      console.warn("Date invalide pentru actori:", movieData.actors);
      movieData.actors = [];
    }

    console.log("Date procesate pentru spectacol:", movieData);
    
    // Returnăm datele în formatul așteptat
    return {
      movie: movieData
    };
  } catch (err) {
    console.error("Eroare la preluarea detaliilor spectacolului:", err);
    throw new Error(err.response?.data?.message || "Nu s-au putut încărca detaliile spectacolului");
  }
};

// Autentificare utilizator
export const sendUserAuthRequest = async (inputs, signup) => {
  try {
    if (signup) {
      // Pentru înregistrare, folosim doar user
      const res = await instance.post("/user/signup", inputs);
      if (res.status === 201) {
        return { message: "Înregistrare reușită! Te poți autentifica acum.", success: true };
      }
    } else {
      // Pentru login, încercăm mai întâi ca admin
      try {
        const adminRes = await instance.post("/admin/login", {
          email: inputs.email,
          password: inputs.password,
        });

        if (adminRes.data.token) {
          return {
            ...adminRes.data,
            role: "admin",
          };
        }
      } catch (adminErr) {
        // Ignorăm eroarea de la admin login și continuăm cu user login
        console.log("Autentificare ca admin eșuată, încercăm ca user");
      }

      // Încercăm autentificarea ca user
      try {
        const userRes = await instance.post("/user/login", inputs);
        
        if (!userRes.data.token) {
          throw new Error("Nu s-a putut obține token-ul de autentificare");
        }

        return {
          ...userRes.data,
          role: "user",
        };
      } catch (userErr) {
        console.error("Eroare la autentificarea ca user:", userErr.response?.data || userErr.message);
        
        if (userErr.response?.data?.message) {
          throw { message: userErr.response.data.message };
        }

        throw { message: "Email sau parolă incorecte" };
      }
    }
  } catch (err) {
    console.error("Eroare la autentificare:", err.message);
    
    if (err.message) {
      throw { message: err.message };
    }

    if (err.response?.data?.error?.code === 11000) {
      throw { message: "Acest email este deja înregistrat. Te rugăm să folosești alt email sau să te autentifici." };
    }

    throw { message: "Email sau parolă incorecte" };
  }
};

// Autentificare admin
export const sendAdminAuthRequest = async (data) => {
  try {
    console.log("Încercăm să trimitem request către /admin/login");
    console.log("Date trimise:", data);

    const res = await instance.post("/admin/login", {
      email: data.email,
      password: data.password,
    });

    console.log("Răspuns primit:", {
      status: res.status,
      statusText: res.statusText,
      data: res.data,
      headers: res.headers
    });

    if (!res.data.token) {
      console.error("Nu s-a primit token în răspuns:", res.data);
      throw new Error("Nu s-a putut obține token-ul de autentificare");
    }

    // Salvăm token-ul și datele adminului
    const token = res.data.token;
    console.log("Token primit:", token);
    
    localStorage.setItem("token", token);
    localStorage.setItem("userId", res.data.admin._id);
    localStorage.setItem("role", "admin");
    
    // Verificăm dacă token-ul a fost salvat corect
    const savedToken = localStorage.getItem("token");
    console.log("Token salvat:", savedToken);
    
    return {
      id: res.data.admin._id,
      token,
      role: "admin",
    };
  } catch (err) {
    console.error("Eroare la autentificare admin - detalii complete:", {
      error: err,
      response: err.response,
      data: err.response?.data,
      status: err.response?.status,
      config: {
        url: err.config?.url,
        method: err.config?.method,
        data: err.config?.data
      }
    });

    if (!err.response) {
      throw { message: "Nu s-a putut conecta la server. Verifică dacă serverul backend este pornit." };
    }

    if (err.response?.data?.message) {
      throw { message: err.response.data.message };
    }

    throw { message: "Email sau parolă incorecte" };
  }
};

// Adaugă un spectacol
export const addMovie = async (data) => {
  try {
    console.log("Încercăm să adăugăm spectacolul:", data);
    
    const res = await instance.post(
      "/movie",
      {
        title: data.title,
        description: data.description,
        posterUrl: data.posterUrl,
        releaseDate: data.releaseDate,
        featured: data.featured || false,
        actors: data.actors || [],
        showTimes: data.showTimes || [],
        sala: data.sala,
        numarLocuri: data.numarLocuri,
        pret: data.pret,
        regizor: data.regizor,
        durata: data.durata,
        gen: data.gen
      },
      {
        headers: getAuthHeader(),
      }
    );

    if (res.status !== 201) {
      throw new Error("Eroare la adăugarea spectacolului");
    }

    console.log("Spectacol adăugat cu succes:", res.data);
    return res.data;
  } catch (err) {
    console.error("Eroare la adăugarea spectacolului:", err.response?.data || err);
    throw err.response?.data || { message: "Eroare la adăugarea spectacolului" };
  }
};

// Actualizează un spectacol
export const updateMovie = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Nu sunteți autentificat. Vă rugăm să vă autentificați din nou.");
    }

    console.log("Încercăm să actualizăm filmul cu ID:", id);
    console.log("Token folosit:", token);

    const response = await instance.put(
      `/movie/${id}`,
      data
    );

    if (response.status !== 200) {
      throw new Error("Eroare la actualizarea spectacolului");
    }

    return response.data;
  } catch (err) {
    console.error("Eroare la actualizarea spectacolului:", {
      error: err,
      response: err.response,
      data: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers
    });
    
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      throw new Error("Sesiunea a expirat. Vă rugăm să vă autentificați din nou.");
    }
    throw err;
  }
};

// Șterge un spectacol
export const deleteMovie = async (id) => {
  try {
    const res = await instance.delete(`/movie/${id}`, {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la ștergerea spectacolului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la ștergerea spectacolului:", err);
    throw err;
  }
};

// Anulează un spectacol
export const cancelMovie = async (id) => {
  try {
    const res = await instance.post(
      `/movie/${id}/cancel`,
      {},
      {
        headers: getAuthHeader(),
      }
    );

    if (res.status !== 200) {
      throw new Error("Eroare la anularea spectacolului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la anularea spectacolului:", err);
    throw err;
  }
};

// Creare rezervare nouă
export const newBooking = async (data) => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("Utilizatorul nu este autentificat");
    }

    console.log("Creating booking with data:", {
      movie: data.movie,
      seatNumbers: data.seatNumbers,
      date: data.date,
      showTimeId: data.showTimeId,
      user: userId
    });

    const res = await instance.post(
      "/booking",
      {
        movie: data.movie,
        seatNumbers: data.seatNumbers,
        date: data.date,
        showTimeId: data.showTimeId,
        user: userId
      },
      {
        headers: getAuthHeader(),
      }
    );

    if (res.status !== 201) {
      throw new Error("Eroare la crearea rezervării");
    }

    if (!res.data.bookings || !Array.isArray(res.data.bookings)) {
      throw new Error("Format de răspuns invalid de la server");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la crearea rezervării:", err.response?.data || err);
    throw err.response?.data || { message: "Eroare la crearea rezervării" };
  }
};

// Preluare locurile ocupate
export const getOccupiedSeats = async (movieId, showTimeId) => {
  try {
    const res = await instance.get(`/booking/occupied-seats?movieId=${movieId}&showTimeId=${showTimeId}`);
    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea locurilor ocupate:", err);
    throw err;
  }
};

// Preluare rezervările utilizatorului
export const getUserBooking = async () => {
  try {
    const id = localStorage.getItem("userId");
    const res = await instance.get(`/user/bookings/${id}`);

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea rezervărilor utilizatorului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea rezervărilor utilizatorului:", err);
    throw err;
  }
};

// Șterge o rezervare
export const deleteBooking = async (id) => {
  try {
    const res = await instance.delete(`/booking/${id}`);

    if (res.status !== 200) {
      throw new Error("Eroare la ștergerea rezervării");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la ștergerea rezervării:", err);
    throw err;
  }
};

// Preluare detalii utilizator
export const getUserDetails = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("Utilizatorul nu este autentificat");
    }

    const res = await instance.get(`/user/${userId}`);
    if (res.status !== 200) {
      throw new Error("Nu s-au putut prelua detaliile utilizatorului");
    }
    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea detaliilor utilizatorului:", err);
    throw err;
  }
};

// Preluare detalii admin
export const getAdminById = async () => {
  try {
    const adminId = localStorage.getItem("userId"); // Folosim userId (unificat)
    const res = await instance.get(`/admin/${adminId}`);

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea detaliilor adminului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea detaliilor adminului:", err);
    throw err;
  }
};

// Preluare toate rezervările (pentru admin)
export const getAllBookings = async () => {
  try {
    const res = await instance.get("/booking/all", {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea rezervărilor");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea rezervărilor:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    throw err;
  }
};

// Preluare statistici (pentru admin)
export const getStatistics = async () => {
  try {
    const res = await instance.get("/admin/statistics", {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea statisticilor");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea statisticilor:", err);
    throw err;
  }
};

// Obține datele adminului
export const getAdminData = async () => {
  try {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      throw new Error("Nu există admin autentificat");
    }

    const res = await instance.get(`/admin/${adminId}`, {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea datelor adminului");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea datelor adminului:", err);
    throw err;
  }
};

// Obține rezervările adminului
export const getAdminBookings = async () => {
  try {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      throw new Error("Nu există admin autentificat");
    }

    const res = await instance.get(`/admin/${adminId}/bookings`, {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea rezervărilor");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea rezervărilor:", err);
    throw err;
  }
};

// Obține statisticile adminului
export const getAdminStatistics = async () => {
  try {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      throw new Error("Nu există admin autentificat");
    }

    const res = await instance.get(`/admin/statistics`, {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea statisticilor");
    }

    return res.data;
  } catch (err) {
    console.error("Eroare la preluarea statisticilor:", err);
    throw err;
  }
};

export const addRating = async (movieId, userId, rating) => {
  const res = await instance.post(`/movie/${movieId}/rate`, {
    userId,
    rating
  });
  
  if (res.status !== 200) {
    throw new Error("Eroare la adăugarea rating-ului");
  }
  
  return res.data;
};

export const getUserRating = async (movieId, userId) => {
  const res = await instance.get(`/movie/${movieId}/rating?userId=${userId}`);
  
  if (res.status !== 200) {
    throw new Error("Eroare la obținerea rating-ului");
  }
  
  return res.data.rating;
};

export const getAllUsers = async () => {
  try {
    const res = await instance.get('/user');
    if (res.status !== 200) {
      throw new Error('Nu s-au putut prelua utilizatorii');
    }
    return res.data;
  } catch (err) {
    console.error('Eroare la preluarea utilizatorilor:', err);
    throw err;
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await instance.delete(`/user/${id}`);
    if (res.status !== 200) {
      throw new Error('Nu s-a putut șterge utilizatorul');
    }
    return res.data;
  } catch (err) {
    console.error('Eroare la ștergerea utilizatorului:', err);
    throw err;
  }
};

export const updateUser = async (id, data) => {
  try {
    const res = await instance.put(`/user/${id}`, data);
    if (res.status !== 200) {
      throw new Error('Nu s-a putut actualiza utilizatorul');
    }
    return res.data;
  } catch (err) {
    console.error('Eroare la actualizarea utilizatorului:', err);
    throw err;
  }
};

// Preluare notificări utilizator
export const getUserNotifications = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("Utilizatorul nu este autentificat");
    }

    const res = await instance.get(`/notification/user/${userId}`, {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea notificărilor");
    }

    return res.data.notifications;
  } catch (err) {
    console.error("Eroare la preluarea notificărilor:", err);
    throw err;
  }
};

// Marchează o notificare ca citită
export const markNotificationAsRead = async (notificationId) => {
  try {
    const res = await instance.patch(
      `/notification/${notificationId}/read`,
      {},
      {
        headers: getAuthHeader(),
      }
    );

    if (res.status !== 200) {
      throw new Error("Eroare la marcarea notificării ca citită");
    }

    return res.data.notification;
  } catch (err) {
    console.error("Eroare la marcarea notificării ca citită:", err);
    throw err;
  }
};

// Șterge o notificare
export const deleteNotification = async (notificationId) => {
  try {
    const res = await instance.delete(`/notification/${notificationId}`, {
      headers: getAuthHeader(),
    });

    if (res.status !== 200) {
      throw new Error("Eroare la ștergerea notificării");
    }

    return true;
  } catch (err) {
    console.error("Eroare la ștergerea notificării:", err);
    throw err;
  }
};