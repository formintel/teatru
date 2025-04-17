// src/api-helpers/api-helpers.js
import axios from "axios";

// Configurare pentru axios
const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // timeout de 5 secunde
});

// Interceptor pentru request-uri
instance.interceptors.request.use(
  (config) => {
    console.log("Request config:", {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
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
    console.log("Response received:", {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("Response error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
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
    const res = await instance.get(`/movie/${id}`);
    console.log("Răspuns brut de la backend:", res.data);
    
    // Verificăm dacă răspunsul conține datele filmului
    if (!res.data) {
      throw new Error("Nu s-au primit date de la server");
    }

    // Verificăm dacă avem un obiect movie în răspuns
    const movieData = res.data.movie || res.data;
    if (!movieData) {
      throw new Error("Nu s-au găsit date pentru film");
    }

    // Verificăm dacă avem showTimes
    if (!movieData.showTimes || !Array.isArray(movieData.showTimes)) {
      console.warn("Nu s-au găsit showTimes sau nu este un array:", movieData.showTimes);
      movieData.showTimes = [];
    }

    // Returnăm datele în formatul așteptat
    return {
      movie: movieData
    };
  } catch (err) {
    console.error("Eroare la preluarea detaliilor filmului:", err);
    throw new Error(err.response?.data?.message || "Nu s-au putut încărca detaliile filmului");
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
    
    return {
      ...res.data,
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
      throw new Error("Token not found");
    }

    console.log("Date trimise către backend:", data);

    // Pregătim datele pentru actualizare
    const updateData = {
      title: data.title,
      description: data.description,
      posterUrl: data.posterUrl,
      pret: data.pret,
      gen: data.gen,
      regizor: data.regizor,
      durata: data.durata,
      sala: data.sala,
      numarLocuri: data.numarLocuri,
      actors: data.actors,
      showTimes: data.showTimes.map(showTime => ({
        _id: showTime._id,
        date: new Date(showTime.date).toISOString(),
        availableSeats: showTime.availableSeats || data.numarLocuri
      }))
    };

    console.log("Date procesate pentru actualizare:", updateData);

    const response = await instance.put(
      `/movie/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Eroare la actualizarea spectacolului:", err);
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
    const id = localStorage.getItem("userId");
    const res = await instance.get(`/user/${id}`);

    if (res.status !== 200) {
      throw new Error("Eroare la preluarea detaliilor utilizatorului");
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
    const res = await instance.get("/admin/bookings", {
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

    const res = await instance.get(`/admin/${adminId}/statistics`, {
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